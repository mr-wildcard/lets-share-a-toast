import React, { FunctionComponent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { animated, to, useSpring, useTransition } from "@react-spring/web";

import { firebaseData } from "@web/core/firebase/data";
import { negotiateLoginToFirebase } from "./helpers/negotiateLoginToFirebase";
import { AnimatedImages } from "./components/AnimatedImages";

const AppLoader: FunctionComponent = observer(({ children }) => {
  const [backgroundAnimated, setBackgroundAnimated] = useState(false);

  const appReady = firebaseData.dataLoadingPercentage === 100;

  useEffect(() => {
    if (backgroundAnimated) {
      negotiateLoginToFirebase().catch((error) => {
        console.error("An error occured while login in to Firebase", error);
      });
    }
  }, [backgroundAnimated]);

  const { progression } = useSpring({
    config: {
      clamp: true,
    },
    progression: firebaseData.dataLoadingPercentage,
  });

  const transitions = useTransition(!appReady, {
    from: {
      enterPath1: 100,
      enterPath2: 100,
      leavePath1: 100,
      leavePath2: 100,
    },
    enter: {
      enterPath1: 0,
      enterPath2: 0,
      leavePath1: 100,
      leavePath2: 100,
      onRest() {
        setBackgroundAnimated(true);
      },
    },
    leave: {
      enterPath1: 0,
      enterPath2: 0,
      leavePath1: 0,
      leavePath2: 0,
    },
  });

  return (
    <>
      {transitions(
        (paths, item) =>
          item && (
            <animated.div
              style={{
                position: "fixed",
                inset: "0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9,
                backgroundColor: "white",
                clipPath: to(
                  [paths.leavePath1, paths.leavePath2],
                  (leavePath1, leavePath2) =>
                    `polygon(0% 0%, ${leavePath1}% 0%, ${leavePath2}% 100%, 0% 100%)`
                ),
              }}
            >
              <animated.div
                style={{
                  position: "absolute",
                  inset: "0px",
                  backgroundColor: "#f6e05e",
                  clipPath: to(
                    [paths.enterPath1, paths.enterPath2],
                    (enterPath1, enterPath2) =>
                      `polygon(${enterPath1}% 0%, 100% 0%, 100% 100%, ${enterPath2}% 100%)`
                  ),
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
            </animated.div>
          )
      )}

      {appReady && children}
    </>
  );
});

export { AppLoader };
