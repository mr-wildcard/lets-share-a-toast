import { extendTheme } from "@chakra-ui/react"

export const FONT_FAMILY_BODY = 'Quicksand, sans-serif';

export default extendTheme({
  fonts: {
    body: FONT_FAMILY_BODY,
    heading: FONT_FAMILY_BODY,
    mono: FONT_FAMILY_BODY,
  },
});
