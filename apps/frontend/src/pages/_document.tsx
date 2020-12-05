import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

import { FONT_FAMILY_BODY } from 'frontend/core/theme';

class TOASTDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link
            href="https://fonts.googleapis.com/css?family=Quicksand:400,500,700&display=swap"
            rel="stylesheet"
            key="google-font-1"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Kaushan+Script&display=swap&text=Let'sshareaTOAST!"
            rel="stylesheet"
            key="google-font-2"
          />
        </Head>
        <body style={{ fontFamily: FONT_FAMILY_BODY, fontWeight: 500 }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default TOASTDocument;
