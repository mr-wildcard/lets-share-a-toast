import React, { Suspense, useEffect } from "react";
import { ChakraProvider, CSSReset, Flex, Spinner } from "@chakra-ui/react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./core/styles.css";
import Header from "./header/Header";
import customTheme from "./core/theme";
import AppLoader from "./core/components/AppLoader";
import useStores from "./core/hooks/useStores";
import Home from "@web/pages/home";
import Subjects from "@web/pages/subjects";
import Votes from "@web/pages/votes";
import PageNotFound from "@web/pages/404";

export default function LetsShareATOAST() {
  const { ui } = useStores();

  useEffect(() => {
    console.log(
      "%cLet's share a 🍞 !",
      "padding-left: 70px; background: url(https://media.giphy.com/media/XgGwL8iUwHIOOMNwmH/giphy.gif); background-size: contain; background-repeat: no-repeat; font-size: 60px;color: black; font-weight: bold; font-style: italic; font-family: serif; text-shadow: 3px 3px 0 rgb(245,221,8)"
    );

    ui.setWindowSize();
    // TODO: handle notifications
    // notifications.initialize(toaster);
  }, [ui]);

  return (
    <Suspense
      fallback={
        <Flex my={10} align="center" justify="center">
          <Spinner />
        </Flex>
      }
    >
      <ChakraProvider theme={customTheme}>
        <CSSReset />

        <AppLoader>
          <Router>
            <Header />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/subjects" component={Subjects} />
              <Route path="/vote" component={Votes} />
              <Route component={PageNotFound} />
            </Switch>
          </Router>
        </AppLoader>
      </ChakraProvider>
    </Suspense>
  );
}
