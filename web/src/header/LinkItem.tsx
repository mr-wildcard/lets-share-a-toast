import React, { FunctionComponent, useEffect, useState } from "react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { useLocation } from "react-router";
import { Link as RouterLink } from "react-router-dom";

import { pageColorsByPathname, Pathnames } from "@web/core/constants";
import HighlightedText from "@web/core/components/HighlightedText";
import { ui } from "@web/core/stores/ui";

interface Props {
  href: Pathnames;
  bgColor: string;
}

const LinkItem: FunctionComponent<Props> = ({ children, href, bgColor }) => {
  const { pathname } = useLocation();

  const [hovered, setHover] = useState(false);

  const currentlySelected = pathname === href;

  useEffect(() => {
    const currentPageBgColor =
      pageColorsByPathname[pathname as Pathnames | "*"] ||
      pageColorsByPathname["*"];

    ui.currentPageBgColor = hovered ? bgColor : currentPageBgColor;
  }, [bgColor, hovered, pathname]);

  return (
    <>
      {!currentlySelected && (
        <ChakraLink
          as={RouterLink}
          to={href}
          fontWeight="bold"
          fontSize="lg"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {children}
        </ChakraLink>
      )}

      {currentlySelected && (
        <HighlightedText fontWeight="bold" fontSize="lg" bgColor={bgColor}>
          {children}
        </HighlightedText>
      )}
    </>
  );
};

export default LinkItem;
