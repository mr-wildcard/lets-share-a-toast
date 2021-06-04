import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toJS, when } from "mobx";
import { observer } from "mobx-react-lite";
import { animated, to, useTransition, config } from "@react-spring/web";

import Loader from "@web/core/components/Loader";

enum BackgroundAnimationState {
  INITIAL,
  ENTERED,
  LEFT,
}

const AppLoader: FunctionComponent = ({ children }) => {
  const [
    loaderAnimationState,
    setLoaderAnimationState,
  ] = useState<BackgroundAnimationState>(BackgroundAnimationState.INITIAL);

  const [appReady, setAppReady] = useState(false);
  const [needToLogin, setNeedToLogin] = useState(false);

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
      /**
       * Make the login button appear.
       */
      setNeedToLogin(true);

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

  const loggin = useCallback(() => {
    setNeedToLogin(false);

    import("@web/core/firebase").then(({ signin }) => {
      signin().catch((error) => {
        console.error("An error occured while signin to Firebase", error);

        setNeedToLogin(true);
      });
    });
  }, []);

  const bgAnimations = useTransition(appReady, {
    config: config.gentle,
    from: {
      clipPath: [100, 150, 100, 150],
    },
    enter: {
      clipPath: [0, 0, 100, 150],
      onRest() {
        setLoaderAnimationState(BackgroundAnimationState.ENTERED);
      },
    },
    leave: {
      clipPath: [0, 0, 0, 0],
    },
    onDestroyed() {
      setLoaderAnimationState(BackgroundAnimationState.LEFT);
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
          {bgAnimations(({ clipPath }, appIsLoaded) => {
            return (
              !appIsLoaded && (
                <animated.div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f6e05e",
                    clipPath: to(
                      clipPath,
                      (path1, path2, path3, path4) =>
                        `polygon(${path1}% 0%, ${path3}% 0%, ${path4}% 100%, ${path2}% 100%)`
                    ),
                  }}
                >
                  {!needToLogin && <Loader />}

                  {needToLogin && (
                    <button
                      style={{
                        position: "relative",
                        padding: "15px 20px 15px 70px",
                        borderRadius: "6px",
                        border: "2px solid cornflowerblue",
                        backgroundColor: "white",
                        fontFamily: "Quicksand, sans-serif",
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                      type="button"
                      onClick={loggin}
                    >
                      <img
                        style={{
                          position: "absolute",
                          left: "-30px",
                          top: "-30px",
                          pointerEvents: "none",
                        }}
                        width={110}
                        height={110}
                        src="https://media.giphy.com/media/oxYfkYJp6ycxrs1paJ/giphy.gif"
                        alt="Page behind a login button"
                      />
                      Login
                    </button>
                  )}
                </animated.div>
              )
            );
          })}
        </div>
      )}
    </>
  );
};

export default observer(AppLoader);
