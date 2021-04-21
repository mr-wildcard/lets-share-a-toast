import React, { FunctionComponent, useMemo } from 'react';
import * as C from '@chakra-ui/react';
import { useSpring, animated } from '@react-spring/web';

interface Props extends C.BoxProps {
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
    <C.Text as="span" position="relative" {...boxProps}>
      <C.Text
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
      <C.Text position="relative" as="span">
        {children}
      </C.Text>
    </C.Text>
  );
};

export default React.memo(HighlightedText);
