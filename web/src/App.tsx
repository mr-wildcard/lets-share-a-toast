import React, { Suspense, useEffect } from "react";
import { ChakraProvider, CSSReset, Flex, useTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import customTheme from "./core/theme";
import { spacing } from "@web/core/constants";
import { PageSkeleton } from "@web/core/components/PageSkeleton";
import Header from "@web/header/Header";

const Home = React.lazy(() => import("./pages/home"));
const Subjects = React.lazy(() => import("./pages/subjects"));
const Votes = React.lazy(() => import("./pages/votes"));
const PageNotFound = React.lazy(() => import("./pages/404"));

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

      <Flex minH="100%" direction="column" p={`${spacing.stylizedGap}px`}>
        <Router>
          <Route component={Header} />

          <Flex
            as="main"
            direction="column"
            flex={1}
            marginTop={`${spacing.stylizedGap}px`}
          >
            <Suspense fallback={<PageSkeleton />}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/subjects" component={Subjects} />
                <Route path="/vote" component={Votes} />
                <Route component={PageNotFound} />
              </Switch>
            </Suspense>
          </Flex>
        </Router>
      </Flex>
    </ChakraProvider>
  );
}
