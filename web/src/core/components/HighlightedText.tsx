import React, { FunctionComponent, useMemo } from "react";
import { BoxProps, Text } from "@chakra-ui/react";
import { useSpring, animated } from "@react-spring/web";

interface Props extends BoxProps {
  bgColor: string;
  animDelay?: number;
}

const HighlightedText: FunctionComponent<Props> = ({
  children,
  bgColor,
  animDelay = 0,
  ...boxProps
}) => {
  const [skewX, skewY] = useMemo(
    () => [-(1 + Math.random() * 9), -0.5 + Math.random()],
    []
  );

  const animatedStyles = useSpring({
    delay: animDelay,
    from: { transform: [0, 0, 0, 0] },
    to: {
      transform: [-5, 1.05, skewX, skewY],
    },
  });

  return (
    <Text as="span" position="relative" {...boxProps}>
      <Text
        as={animated.span}
        backgroundColor={bgColor}
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        transformOrigin="0 50%"
        style={{
          // @ts-ignore
          transform: animatedStyles.transform.to<string>(
            (
              translate: number,
              scale: number,
              skewX: number,
              skewY: number
            ): string =>
              `translateX(${translate}px) scaleX(${scale}) skew(${skewX}deg, ${skewY}deg)`
          ),
        }}
      />
      <Text position="relative" as="span">
        {children}
      </Text>
    </Text>
  );
};

export default React.memo(HighlightedText);
