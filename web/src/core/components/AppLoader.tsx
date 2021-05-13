import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import * as C from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { animated, to, useTransition, config } from "@react-spring/web";
import firebase from "firebase/app";
import { toJS, when } from "mobx";

import Loader from "@web/core/components/Loader";
import useStores from "@web/core/hooks/useStores";

enum LoaderAnimationState {
  INITIAL,
  ENTERED,
  LEFT,
}

const AppLoader: FunctionComponent = ({ children }) => {
  const [anim, setAnim] = useState(false);

  const [
    loaderAnimationState,
    setLoaderAnimationState,
  ] = useState<LoaderAnimationState>(LoaderAnimationState.INITIAL);

  const [appReady, setAppReady] = useState(false);
  const [needToLogin, setNeedToLogin] = useState(false);
  const [firebaseInstance, setFirebaseInstance] = useState<
    null | typeof import("@web/core/firebase").default
  >();

  useEffect(() => {
    if (loaderAnimationState === LoaderAnimationState.ENTERED) {
      import("@web/core/firebase").then(({ default: firebase }) => {
        const user = firebase.getCurrentUser();

        if (user) {
          setFirebaseInstance(firebase);
        } else {
          setNeedToLogin(true);
        }
      });
    }
  }, [loaderAnimationState]);

  const loggin = useCallback(() => {
    import("@web/core/firebase").then(({ default: firebase }) => {
      const { signin } = firebase;

      signin()
        .then(() => {
          setFirebaseInstance(firebase);
        })
        .catch(() => {
          setNeedToLogin(true);
        });
    });
  }, []);

  useEffect(() => {
    if (!appReady && firebaseInstance) {
      when(
        () =>
          toJS(firebaseInstance.currentToast) !== undefined &&
          firebaseInstance.users.length > 0 &&
          firebaseInstance.subjects.length > 0,
        () => {
          setAppReady(true);
        }
      );
    }
  }, [firebaseInstance]);

  const bgAnimations = useTransition(appReady, {
    config: config.gentle,
    from: {
      clipPath: [100, 150, 100, 150],
    },
    enter: {
      clipPath: [0, 0, 100, 150],
      onRest() {
        setLoaderAnimationState(LoaderAnimationState.ENTERED);
      },
    },
    leave: {
      clipPath: [0, 0, 0, 0],
    },
    onDestroyed() {
      setLoaderAnimationState(LoaderAnimationState.LEFT);
    },
  });

  return (
    <>
      {loaderAnimationState !== LoaderAnimationState.LEFT && (
        <C.Box
          onClick={() => {
            setAnim(!anim);
          }}
          position="fixed"
          top={0}
          right={0}
          bottom={0}
          left={0}
          zIndex={9}
          style={{
            backgroundColor:
              loaderAnimationState === LoaderAnimationState.INITIAL
                ? "white"
                : "transparent",
          }}
        >
          {bgAnimations(({ clipPath }, appIsLoaded) => {
            return (
              !appIsLoaded && (
                <C.Flex
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
                  {needToLogin && <C.Button onClick={loggin}>Login</C.Button>}
                </C.Flex>
              )
            );
          })}
        </C.Box>
      )}

      {appReady &&
        loaderAnimationState !== LoaderAnimationState.INITIAL &&
        children}
    </>
  );
};

export default observer(AppLoader);
