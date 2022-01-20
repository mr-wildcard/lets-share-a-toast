import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Box, BoxProps, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { ui } from "@web/core/stores/ui";
import { AnimatedShapes } from "@web/core/components/AnimatedShapes";
import { backgroundShapesColorByPageColor } from "@web/core/constants";
import { useDebouncedCallback } from "@web/core/components/hooks/useDebouncedCallback";

export const ColoredBackground: FunctionComponent<BoxProps> = observer(
  ({ children }) => {
    const rootElementRef = useRef() as React.MutableRefObject<HTMLDivElement>;

    const [size, setSize] = useState<number[]>([]);

    const debouncedSetSize = useDebouncedCallback((width, height) => {
      setSize([width, height]);
    }, 500);

    useEffect(() => {
      const backgroundRO = new ResizeObserver((entries) => {
        const [mutation] = entries;

        const width = mutation.contentRect.width;
        const height = mutation.contentRect.height;

        debouncedSetSize(width, height);
      });

      backgroundRO.observe(rootElementRef.current);

      return function dispose() {
        backgroundRO.disconnect();
      };
    }, []);

    const shapesColor = backgroundShapesColorByPageColor[ui.currentPageBgColor];

    return (
      <Flex
        ref={rootElementRef}
        flex={1}
        position="relative"
        borderRadius={3}
        transition="background-color 500ms ease"
        style={{
          backgroundColor: ui.currentPageBgColor,
        }}
      >
        {size.length === 2 && (
          <Box position="absolute" inset="0" zIndex={0}>
            <AnimatedShapes
              width={size[0]}
              height={size[1]}
              color={shapesColor}
            />
          </Box>
        )}

        {children}
      </Flex>
    );
  }
);
