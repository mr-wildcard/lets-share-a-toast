import React, { FunctionComponent, useMemo } from 'react';
import * as C from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { animated, useTransition, config } from 'react-spring';

import Loader from 'frontend/core/components/Loader';
import useStores from 'frontend/core/hooks/useStores';

const AppLoader: FunctionComponent = ({ children }) => {
  const { appLoading } = useStores();

  const bgAnimations = useTransition(!appLoading.pageLoaded, {
    config: config.gentle,
    from: {
      clipPath: [100, 100, 100, 100],
    },
    enter: () => async (next) => {
      next({ clipPath: [0, 100, 100, 100] });
      await next({ clipPath: [0, 0, 100, 100], delay: 100 });
    },
    leave: () => async (next) => {
      next({ clipPath: [0, 0, 0, 100] });
      await next({ clipPath: [0, 0, 0, 0], delay: 100 });
    },
    onRest(item, state) {
      if (item && state.phase === 'enter') {
        appLoading.loaderEntering = false;
        appLoading.loaderEntered = true;
      }
    },
  });

  const showWhiteBackground = useMemo(() => {
    return appLoading.loaderEntering && !appLoading.loaderEntered;
  }, [appLoading.loaderEntering, appLoading.loaderEntered]);

  return (
    <>
      {showWhiteBackground && (
        <C.Box
          position="fixed"
          backgroundColor="white"
          top={0}
          right={0}
          bottom={0}
          left={0}
          zIndex={9}
        />
      )}

      {bgAnimations(({ clipPath }, item) => {
        return (
          item && (
            <C.Box
              as={animated.div}
              style={{
                // @ts-ignore
                clipPath: clipPath.to(
                  (path1, path2, path3, path4) =>
                    `polygon(${path1}% 0%, ${path3}% 0%, ${path4}% 100%, ${path2}% 100%)`
                ),
              }}
              position="fixed"
              backgroundColor="yellow.300"
              top={0}
              right={0}
              bottom={0}
              left={0}
              zIndex={10}
            >
              <C.Flex
                align="center"
                justify="center"
                zIndex={11}
                w="100%"
                h="100%"
              >
                <Loader />
              </C.Flex>
            </C.Box>
          )
        );
      })}

      {appLoading.loaderEntered && children}
    </>
  );
};

export default observer(AppLoader);
