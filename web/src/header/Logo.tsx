import React from 'react';
import * as C from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';

import { customFonts, Pathnames } from '@web/core/constants';
import css from './Logo.module.css';

const baseProps = {
  fontFamily: customFonts.logo,
};

const Content = () => (
  <>
    Let&apos;s share a
    <C.Text
      as="span"
      className={css.toast}
      d="inline-block"
      pl={2}
      pr={1}
      role="img"
      aria-labelledby="Logo"
    >
      🍞
    </C.Text>
    !
  </>
);

const Logo = () => {
  const { pathname } = useLocation();

  if (pathname === Pathnames.HOME) {
    return (
      <C.Heading size="xl" {...baseProps}>
        <Content />
      </C.Heading>
    );
  }

  return (
    <Link to={Pathnames.HOME}>
      <C.Box
        {...baseProps}
        as={C.Heading}
        position="relative"
        className={css.heading}
        _after={{
          // @ts-ignore
          content: `""`,
          position: 'absolute',
          bottom: '-2px',
          height: '2px',
          width: '100%',
          left: 0,
          transition: 'transform 500ms cubic-bezier(1, 0, 0, 1)',
          backgroundColor: 'black',
          transformOrigin: '50% 50%',
          transform: 'scaleX(0)',
        }}
      >
        <Content />
      </C.Box>
    </Link>
  );
};

export default Logo;