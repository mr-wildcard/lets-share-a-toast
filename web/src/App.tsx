import React, { Suspense, useEffect } from "react";
import { ChakraProvider, CSSReset, Flex, useTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Header from "./header/Header";
import customTheme from "./core/theme";
import { Pathnames, spacing } from "./core/constants";
import { PageSkeleton } from "./core/components/PageSkeleton";
import { Main } from "./Main";

const Home = React.lazy(() => import("./homepage"));
const Subjects = React.lazy(() => import("./subjects"));
const Votes = React.lazy(() => import("./votes"));
const PageNotFound = React.lazy(() => import("./pages/PageNotFound"));

dayjs.extend(relativeTime);

export default function LetsShareATOAST() {
  const theme = useTheme();

  useEffect(() => {
    console.log(
      "%cLet's share a 🍞 !",
      "padding-left: 70px; background: url(https://media.giphy.com/media/XgGwL8iUwHIOOMNwmH/giphy.gif); background-size: contain; background-repeat: no-repeat; font-size: 60px;color: black; font-weight: bold; font-style: italic; font-family: serif; text-shadow: 3px 3px 0 rgb(245,221,8)"
    );
  }, []);

  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />

      <Router>
        <Main>
          <Route component={Header} />

          <Suspense fallback={<PageSkeleton />}>
            <Switch>
              <Route exact path={Pathnames.HOME} component={Home} />
              <Route path={Pathnames.SUBJECTS} component={Subjects} />
              <Route path={Pathnames.HOME} component={Votes} />
              <Route component={PageNotFound} />
            </Switch>
          </Suspense>
        </Main>
      </Router>
    </ChakraProvider>
  );
}
