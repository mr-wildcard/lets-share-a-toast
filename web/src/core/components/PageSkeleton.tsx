import React from "react";
import { Skeleton, Spinner } from "@chakra-ui/react";
import { useLocation } from "react-router";

import { pageColorsByPathname, Pathnames } from "@web/core/constants";
import customTheme from "@web/core/theme";

export const PageSkeleton = () => {
  const { pathname } = useLocation();

  return (
    <Skeleton
      flex={1}
      speed={2}
      startColor={pageColorsByPathname[pathname as Pathnames | "*"]}
      endColor={customTheme.colors.gray["100"]}
    />
  );
};
