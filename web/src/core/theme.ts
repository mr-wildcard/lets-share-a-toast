import { createSystem, defaultConfig } from "@chakra-ui/react";

export const FONT_FAMILY_BODY = "Quicksand, sans-serif";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: FONT_FAMILY_BODY },
        body: { value: FONT_FAMILY_BODY },
        mono: { value: FONT_FAMILY_BODY },
      },
    },
  },
});
