import React, { Suspense, useEffect } from "react";
import { ChakraProvider, Skeleton } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import dayjs from "dayjs";
import { ThemeProvider } from "next-themes";
import relativeTime from "dayjs/plugin/relativeTime";

import { system } from "./core/theme";
import Header from "./header/Header";
import { Pathnames } from "./core/constants";
import { ColoredBackground } from "./core/components/ColoredBackground";
import { Main } from "./Main";
import { Toaster } from "@web/notifications";

const Home = React.lazy(() => import("./homepage"));
const Subjects = React.lazy(() => import("./subjects"));
const Votes = React.lazy(() => import("./votes"));
const PageNotFound = React.lazy(() => import("./pages/PageNotFound"));

dayjs.extend(relativeTime);

export default function LetsShareATOAST() {
  useEffect(() => {
    console.log(
      "%cLet's share a 🍞 !",
      "padding-left: 70px; background: url(https://media.giphy.com/media/XgGwL8iUwHIOOMNwmH/giphy.gif); background-size: contain; background-repeat: no-repeat; font-size: 60px;color: black; font-weight: bold; font-style: italic; font-family: serif; text-shadow: 3px 3px 0 rgb(245,221,8)"
    );
  }, []);

  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <Router>
          <Toaster />
          <Main>
            <Header />

            <ColoredBackground>
              <Suspense fallback={<Skeleton />}>
                <Routes>
                  <Route path={Pathnames.HOME} element={<Home />} />
                  <Route path={Pathnames.SUBJECTS} element={<Subjects />} />
                  <Route path={Pathnames.VOTING_SESSION} element={<Votes />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </Suspense>
            </ColoredBackground>
          </Main>
        </Router>
      </ThemeProvider>
    </ChakraProvider>
  );
}
