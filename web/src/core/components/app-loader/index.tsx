import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toJS, when } from "mobx";
import { observer } from "mobx-react-lite";
import { animated, config, to, useSpring } from "@react-spring/web";

import { AnimatedImages } from "./animated-images";

enum BackgroundAnimationState {
  INITIAL,
  ENTERED,
  LEFT,
}

const AppLoader: FunctionComponent = ({ children }) => {
  const [loaderAnimationState, setLoaderAnimationState] =
    useState<BackgroundAnimationState>(BackgroundAnimationState.INITIAL);

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
    if (loaderAnimationState === BackgroundAnimationState.ENTERED) {
      import("@web/core/firebase").then(loadFirebaseData).catch((error) => {
        console.error("An error occured while loading Firebase", { error });
      });
    }
  }, [loaderAnimationState]);

  const { value: path1 } = useSpring({
    config: config.gentle,
    delay: 150,
    from: { value: 100 },
    to: { value: 0 },
  });

  const { value: path2 } = useSpring({
    config: config.gentle,
    delay: 230,
    from: { value: 100 },
    to: { value: 0 },
    onRest() {
      setLoaderAnimationState(BackgroundAnimationState.ENTERED);
    },
  });

  return (
    <>
      {loaderAnimationState !== BackgroundAnimationState.LEFT && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 9,
            backgroundColor:
              loaderAnimationState === BackgroundAnimationState.INITIAL
                ? "white"
                : "transparent",
          }}
        >
          <animated.div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              backgroundColor: "#f6e05e",
              clipPath: to(
                [path1, path2],
                (path1, path2) =>
                  `polygon(${path1}% 0, 100% 0, 100% 100%, ${path2}% 100%)`
              ),
            }}
          >
            <AnimatedImages />
          </animated.div>
        </div>
      )}
    </>
  );
};

export default observer(AppLoader);
