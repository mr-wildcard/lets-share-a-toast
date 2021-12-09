import { useEffect, useMemo, useState } from "react";
import { config, useTransition, useSpring } from "@react-spring/web";

const useActionsAnimations = () => {
  const [backgroundOpened, openBackground] = useState(false);
  const [toastCelebration, setTOASTCelebration] = useState(false);
  const [backgoundAnimationFinished, setBackgoundAnimationFinished] =
    useState(true);

  const toastCelebrationAnimation = useTransition(toastCelebration, {
    from: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
    leave: {
      opacity: 0,
    },
  });

  const [buttonOpenActionsCSSTransforms, backgroundClipPaths] = useMemo(() => {
    return Math.random() > 0.5
      ? ["rotate(0.5deg) translateY(-70px)", [0, 15]]
      : ["rotate(-1.5deg) translateY(-60px)", [15, 0]];
    // I want a new value each time `backgroundOpened` change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundOpened]);

  const backgroundAnimation = useSpring({
    config: config.stiff,
    clipPath: !backgroundOpened ? [100, 100] : backgroundClipPaths,
    onStart() {
      setBackgoundAnimationFinished(false);
    },
    onRest() {
      setBackgoundAnimationFinished(true);
    },
  });

  useEffect(() => {
    let timeout: number;

    if (toastCelebration) {
      timeout = setTimeout(() => {
        setTOASTCelebration(false);
      }, 5000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [toastCelebration]);

  return {
    toastCreation: {
      display: setTOASTCelebration,
      animation: toastCelebrationAnimation,
    },
    background: {
      opened: backgroundOpened,
      open: openBackground,
      animation: backgroundAnimation,
      animationFinished: backgoundAnimationFinished,
      finalClipPaths: backgroundClipPaths,
      buttonOpenActionsCSSTransforms,
    },
  };
};

export default useActionsAnimations;
