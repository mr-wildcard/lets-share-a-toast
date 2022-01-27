import { when } from "mobx";

import { firebaseData } from "@web/core/firebase/data";
import { signin } from "@web/core/firebase";

export async function negotiateLoginToFirebase() {
  /**
   * Wait for Firebase to retrieve the current connected user.
   * `null` : user is signed out.
   * not `null` : user signed in.
   * https://medium.com/firebase-developers/why-is-my-currentuser-null-in-firebase-auth-4701791f74f0
   */
  await when(() => firebaseData.currentUserIsLoaded);

  /**
   * If user is signed out.
   */
  if (firebaseData.connectedUser === null) {
    try {
      await signin();
    } catch (error) {
      console.error("An error occured while signin to Firebase", error);
    }
  }
}
