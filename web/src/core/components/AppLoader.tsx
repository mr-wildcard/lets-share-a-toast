import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
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

    /**
     * Wait for the current TOAST data to be retrieved.
     */
    await when(() => toJS(firebaseData.currentToast) !== undefined);

    /**
     * Make the loader disappear.
     */
    setAppReady(true);
  }, []);

  useEffect(() => {
    if (loaderAnimationState === BackgroundAnimationState.ENTERED) {
      import("@web/core/firebase").then(loadFirebaseData).catch((error) => {
        console.error("An error occured while loading Firebase", { error });
      });
    }
  }, [loaderAnimationState]);

  const loggin = useCallback(() => {
    import("@web/core/firebase").then(({ signin }) => {
      signin().catch(() => {
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
        <Box
          position="fixed"
          top={0}
          right={0}
          bottom={0}
          left={0}
          zIndex={9}
          style={{
            backgroundColor:
              loaderAnimationState === BackgroundAnimationState.INITIAL
                ? "white"
                : "transparent",
          }}
        >
          {bgAnimations(({ clipPath }, appIsLoaded) => {
            return (
              !appIsLoaded && (
                <Flex
                  as={animated.div}
                  align="center"
                  justify="center"
                  w="100%"
                  h="100%"
                  backgroundColor="yellow.300"
                  zIndex={10}
                  style={{
                    // @ts-ignore
                    clipPath: to(
                      clipPath,
                      (path1, path2, path3, path4) =>
                        `polygon(${path1}% 0%, ${path3}% 0%, ${path4}% 100%, ${path2}% 100%)`
                    ),
                  }}
                >
                  <Loader />
                  {needToLogin && <Button onClick={loggin}>Login</Button>}
                </Flex>
              )
            );
          })}
        </Box>
      )}

      {appReady && children}
    </>
  );
};

export default observer(AppLoader);
