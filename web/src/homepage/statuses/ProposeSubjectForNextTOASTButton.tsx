import React from "react";
import { Button, Image } from "@chakra-ui/react";
import { animated, useSpring } from "@react-spring/web";
import { Link } from "react-router-dom";

import { Pathnames } from "@web/core/constants";

const ProposeSubjectForNextTOASTButton = () => {
  const anim = useSpring({
    config: {
      mass: 20,
      tension: 90,
      friction: 50,
    },
    from: {
      transform: [-220, 60, 0],
    },
    to: async (next) => {
      while (1) {
        await next({
          transform: [220, 60, -90],
        });
        await next({
          transform: [-220, 60, 0],
        });
      }
    },
  });

  return (
    <Button
      to={Pathnames.SUBJECTS}
      as={Link}
      cursor="pointer"
      variant="outline"
      position="relative"
      bg="white"
      size="lg"
      colorScheme="blue"
    >
      Propose a subject for the next TOAST!
      <Image
        pointerEvents="none"
        as={animated.img}
        position="absolute"
        width={115}
        height={115}
        src="https://media.giphy.com/media/d7SlmU3j2QluzkOSIv/giphy.gif"
        style={{
          // @ts-ignore
          transform: anim.transform.to(
            (translateX, translateY, rotate) =>
              `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`
          ),
        }}
      />
    </Button>
  );
};

export default ProposeSubjectForNextTOASTButton;
