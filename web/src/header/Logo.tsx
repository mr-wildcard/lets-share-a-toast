import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";

import { Pathnames } from "@web/core/constants";
import css from "./Logo.module.css";

const baseProps = {
  fontFamily: '"Kaushan Script", cursive',
};

const Content = () => (
  <>
    Let&apos;s share a
    <Text
      as="span"
      className={css.toast}
      d="inline-block"
      pl={2}
      pr={1}
      role="img"
      aria-labelledby="Logo"
    >
      🍞
    </Text>
    !
  </>
);

const Logo = () => {
  const { pathname } = useLocation();

  if (pathname === Pathnames.HOME) {
    return (
      <Heading size="xl" {...baseProps}>
        <Content />
      </Heading>
    );
  }

  return (
    <Link to={Pathnames.HOME}>
      <Box
        {...baseProps}
        as={Heading}
        position="relative"
        className={css.heading}
        _after={{
          // @ts-ignore
          content: `""`,
          position: "absolute",
          bottom: "-2px",
          height: "2px",
          width: "100%",
          left: 0,
          transition: "transform 500ms cubic-bezier(1, 0, 0, 1)",
          backgroundColor: "black",
          transformOrigin: "50% 50%",
          transform: "scaleX(0)",
        }}
      >
        <Content />
      </Box>
    </Link>
  );
};

export default Logo;
