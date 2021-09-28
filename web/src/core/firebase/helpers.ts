import { collection, doc, getFirestore } from "firebase/firestore";
import { getDatabase, ref } from "firebase/database";
import { getFunctions, httpsCallable } from "firebase/functions";

import {
  CloudFunctionName,
  DatabaseRefPaths,
  FirestoreCollection,
} from "@shared/firebase";

export function getFirestoreSubjectCollection(firestore = getFirestore()) {
  return collection(firestore, FirestoreCollection.SUBJECTS);
}

export function getFirestoreSubjectDoc(
  subjectId: string,
  firestore = getFirestore()
) {
  const subjectsCollection = getFirestoreSubjectCollection();

  return doc(subjectsCollection, subjectId);
}

export function getFirebaseCurrentToastRef(database = getDatabase()) {
  return ref(database, DatabaseRefPaths.CURRENT_TOAST);
}

export function getFirebaseVotingSessionRef(database = getDatabase()) {
  return ref(database, DatabaseRefPaths.VOTING_SESSION);
}

export function getCloudFunctionCreateTOAST(functions = getFunctions()) {
  return httpsCallable(functions, CloudFunctionName.CREATE_TOAST);
}

export function getCloudFunctionSetTOASTReady(functions = getFunctions()) {
  return httpsCallable(functions, CloudFunctionName.TOAST_READY);
}

export function getCloudFunctionEndTOAST(functions = getFunctions()) {
  return httpsCallable(functions, CloudFunctionName.END_TOAST);
}

export function getCloudFunctionOpenVotes(functions = getFunctions()) {
  return httpsCallable(functions, CloudFunctionName.OPEN_VOTES);
}

export function getCloudFunctionResolveDeadHeatSubjects(
  functions = getFunctions()
) {
  return httpsCallable(functions, CloudFunctionName.RESOLVE_DEADHEAT_SUBJECTS);
}

export function getCloudFunctionCloseVotes(functions = getFunctions()) {
  return httpsCallable(functions, CloudFunctionName.CLOSE_VOTES);
}

export function getCloudFunctionCancelTOAST(functions = getFunctions()) {
  return httpsCallable(functions, CloudFunctionName.CANCEL_TOAST);
}
