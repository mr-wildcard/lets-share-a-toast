import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toJS, when } from "mobx";
import { observer } from "mobx-react-lite";
import { animated, useSpring } from "@react-spring/web";

import { AnimatedImages } from "./animated-images";
import { firebaseData } from "@web/core/firebase/data";

function getRandomBackgroundPositionForLoadingProgress(progression: number) {
  if (progression === 100 || progression === 0) {
    return progression;
  }

  return Math.ceil(Math.max(0, progression + Math.random() * 50));
}

const AppLoader: FunctionComponent = ({ children }) => {
  const [appReady, setAppReady] = useState(false);

  const loadFirebaseData = useCallback(async () => {
    const { firebaseData } = await import("@web/core/firebase/data");

    /**
     * Wait for Firebase to retrieve the current connected user.
     * `null` : user is signed out.
     * not `null` : user signed in.
     * https://medium.com/firebase-developers/why-is-my-currentuser-null-in-firebase-auth-4701791f74f0
     */
    await when(() => typeof toJS(firebaseData.connectedUser) !== "undefined");

    /**
     * If user is signed out.
     */
    if (firebaseData.connectedUser === null) {
      const { signin } = await import("@web/core/firebase");

      try {
        await signin();
      } catch (error) {
        console.error("An error occured while signin to Firebase", error);
      }

      /**
       * Wait for the `connectedUser` to be a plain object.
       */
      await when(() => toJS(firebaseData.connectedUser) !== null);
    }
  }, []);

  useEffect(() => {
    import("@web/core/firebase").then(loadFirebaseData).catch((error) => {
      console.error("An error occured while loading Firebase", { error });
    });
  }, []);

  const { progression } = useSpring({
    config: {
      clamp: true,
    },
    progression: firebaseData.appLoadingPercentage,
  });

  const { path1, path2 } = useMemo(() => {
    return {
      path1:
        100 -
        getRandomBackgroundPositionForLoadingProgress(
          firebaseData.appLoadingPercentage
        ),
      path2:
        100 -
        getRandomBackgroundPositionForLoadingProgress(
          firebaseData.appLoadingPercentage
        ),
    };
  }, [firebaseData.appLoadingPercentage]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: "0px",
          zIndex: 9,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "0px",
            backgroundColor: "#f6e05e",
            clipPath: `polygon(${path1}% 0, 100% 0, 100% 100%, ${path2}% 100%)`,
            transition: "clip-path 500ms",
          }}
        />

        <animated.span
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "2rem",
            color: "rgba(0, 0, 0, 0.5)",
            fontWeight: "bold",
            fontSize: "120px",
            fontFamily: "Quicksand, sans-serif",
          }}
        >
          {progression.to((value) => `${Math.ceil(value)}%`)}
        </animated.span>

        <AnimatedImages />
      </div>
    </>
  );
};

export default observer(AppLoader);
