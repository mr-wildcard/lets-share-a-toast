import React, { useCallback, useEffect, useState } from "react";
import firebase from "firebase/app";
import { Box, Button } from "@chakra-ui/react";

import {
  DatabaseRefPaths,
  DatabaseVotingSession,
  FirestoreCollection,
  FirestoreSubject,
  SubjectVote,
} from "@shared/firebase";
import { SubjectStatus } from "@shared/enums";
import { Subject } from "@shared/models";

import { firebaseData } from "@web/core/firebase/data";

function getSubjectTotalVotes(votedSubject: SubjectVote) {
  const allVotes = Object.values(votedSubject);

  return allVotes.reduce((totalVotes, votePerUser) => {
    return totalVotes + votePerUser;
  }, 0);
}

export function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [
    votingSession,
    setVotingSession,
  ] = useState<null | DatabaseVotingSession>(null);

  useEffect(() => {
    const databaseVotingSessionRef = firebase
      .database()
      .ref(DatabaseRefPaths.VOTING_SESSION);

    const disposeFirebaseSubjectsListener = firebase
      .firestore()
      .collection(FirestoreCollection.SUBJECTS)
      .where("status", "==", SubjectStatus.AVAILABLE)
      .onSnapshot((snapshot) => {
        const subjects = snapshot.docs.map((doc) => ({
          ...(doc.data() as FirestoreSubject),
          id: doc.id,
          speakers: [],
        }));

        setSubjects(subjects);
      });

    const firebaseVotingSessionListener = databaseVotingSessionRef.on(
      "value",
      (snapshot) => {
        setVotingSession(snapshot.val() as DatabaseVotingSession);
      }
    );

    return () => {
      disposeFirebaseSubjectsListener();

      databaseVotingSessionRef.off("value", firebaseVotingSessionListener);
    };
  }, []);

  const vote = useCallback((subjectId) => {
    return firebase
      .database()
      .ref(DatabaseRefPaths.VOTING_SESSION)
      .child("votes")
      .child(subjectId)
      .child(firebaseData.connectedUser!.uid)
      .transaction((userTotalVotes: null | number) => {
        if (userTotalVotes) {
          if (userTotalVotes >= 3) {
            return null;
          } else {
            return userTotalVotes + 1;
          }
        } else {
          return 1;
        }
      });
  }, []);

  return (
    <Box>
      {votingSession !== null && (
        <Box>
          {subjects.map((subject) => {
            return (
              <Button
                key={subject.id}
                m={3}
                onClick={() => vote(subject.id)}
                disabled={!votingSession.peopleCanVote}
              >
                {subject.id} (
                {votingSession.votes?.[subject.id]
                  ? getSubjectTotalVotes(votingSession.votes[subject.id])
                  : 0}
                )
              </Button>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
