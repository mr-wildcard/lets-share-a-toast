import React, { FunctionComponent, useEffect, useState } from 'react';
import * as C from '@chakra-ui/core';
import { useRouter } from 'next/router';
import Link from 'next/link';

import useStores from 'frontend/core/hooks/useStores';
import { pageColorsByPathname, Pathnames } from 'frontend/core/constants';
import HighlightedText from 'frontend/core/components/HighlightedText';

interface Props {
  href: Pathnames;
  bgColor: string;
}

const LinkItem: FunctionComponent<Props> = ({ children, href, bgColor }) => {
  const { pathname } = useRouter();

  const { ui } = useStores();

  const [hovered, setHover] = useState(false);

  const currentlySelected = pathname === href;

  useEffect(() => {
    const currentPageBgColor =
      pageColorsByPathname[pathname] || pageColorsByPathname['*'];

    ui.currentPageBgColor = hovered ? bgColor : currentPageBgColor;
  }, [bgColor, hovered, pathname, ui]);

  return (
    <>
      {!currentlySelected && (
        <Link href={href}>
          <C.Link
            fontWeight="bold"
            fontSize="lg"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {children}
          </C.Link>
        </Link>
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
