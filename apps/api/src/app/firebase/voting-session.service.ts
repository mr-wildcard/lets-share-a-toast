import { Catch, Injectable, Logger } from '@nestjs/common';
import * as firebase from 'firebase-admin';

import {
  FirebaseCollections,
  FirebaseVotingSessionDocument,
  RealTimeVote,
} from '@letsshareatoast/shared';

import { Subject } from 'api/subjects/entities/subject.entity';

@Injectable()
export class VotingSessionService {
  private logger: Logger = new Logger(VotingSessionService.name);

  get db() {
    return firebase.firestore();
  }

  get votingSession() {
    return this.db.collection(FirebaseCollections.VOTING_SESSION);
  }

  private getToastDocument(toastId: string) {
    return this.votingSession
      .doc(toastId)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          throw new Error(`TOAST id ${toastId} couldn't be found in Firebase.`);
        } else {
          return doc;
        }
      });
  }

  create(toastId: string, subjects: Subject[]) {
    /**
     * Construct a document to be stored in Firestore.
     */
    const votingSessionDocument = subjects.reduce<FirebaseVotingSessionDocument>(
      (firestoreDocument, availableSubject) => {
        firestoreDocument.votes[availableSubject.id] = {};

        return firestoreDocument;
      },
      {
        peopleCanVote: true,
        votes: {},
      }
    );

    return this.votingSession
      .doc(toastId)
      .set(votingSessionDocument)
      .catch((error) => {
        this.logger.error(
          "Voting session couldn't be created because of Firebase error: " +
            error
        );
      });
  }

  addSubject(toastId: string, subjectId: string) {
    const subjectFieldPath = new firebase.firestore.FieldPath(
      'votes',
      subjectId
    );

    return this.getToastDocument(toastId)
      .then((doc) => doc.ref.update(subjectFieldPath, {}))
      .catch((error) => {
        this.logger.error(
          "Subject couldn't be added to voting session because of Firebase error: " +
            error
        );
      });
  }

  deleteSubject(toastId: string, subjectId: string) {
    const subjectFieldPath = new firebase.firestore.FieldPath(
      'votes',
      subjectId
    );

    return this.getToastDocument(toastId)
      .then((doc) =>
        doc.ref.update(subjectFieldPath, firebase.firestore.FieldValue.delete())
      )
      .catch((error) => {
        this.logger.error(
          "Subject couldn't be removed from voting session because of Firebase error: " +
            error
        );
      });
  }

  peopleCanVote(toastId: string, yesWeCan = true) {
    const fieldPath = new firebase.firestore.FieldPath('peopleCanVote');

    return this.getToastDocument(toastId)
      .then((doc) => doc.ref.update(fieldPath, yesWeCan))
      .catch((error) => {
        this.logger.error(
          `Couldn't set \`peopleCanVote\` to ${yesWeCan} because of Firebase error: ` +
            error
        );
      });
  }

  async addVoteToSubject(vote: RealTimeVote) {
    const { currentToastId, userId, subjectId } = vote;

    const userVotesFieldPath = new firebase.firestore.FieldPath(
      'votes',
      subjectId,
      userId
    );

    return this.getToastDocument(currentToastId)
      .then((document) => {
        if (document.get(userVotesFieldPath) >= 3) {
          return document.ref.update(
            userVotesFieldPath,
            firebase.firestore.FieldValue.delete()
          );
        } else {
          return document.ref.update(
            userVotesFieldPath,
            firebase.firestore.FieldValue.increment(1)
          );
        }
      })
      .catch((error) => {
        this.logger.error(
          `Vote from user ${userId} couldn't be added to subject ${subjectId} because of Firebase error: ` +
            error
        );
      });
  }

  getResults(toastId: string) {
    return this.getToastDocument(toastId)
      .then((document) => document.data())
      .catch((error) => {
        this.logger.error(
          `Couldn't get the voting session results because of Firebase error: ` +
            error
        );
      });
  }
}
