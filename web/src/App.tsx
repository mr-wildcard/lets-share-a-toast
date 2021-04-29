import React, { Suspense, FunctionComponent, useEffect } from "react";
import {
  ChakraProvider,
  CSSReset,
  useToast,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { SWRConfig } from "swr";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./core/styles.css";
import Header from "./header/Header";
import Home from "./pages/home";
import Subjects from "./pages/subjects";
import Vote from "./pages/vote";
import customTheme from "./core/theme";
import http from "./core/httpClient";
import AppLoader from "./core/components/AppLoader";
import useStores from "./core/hooks/useStores";

export default function LetsShareATOAST() {
  const toaster = useToast();

  const { ui, notifications } = useStores();

  useEffect(() => {
    console.log(
      "%cLet's share a 🍞 !",
      "padding-left: 70px; background: url(https://media.giphy.com/media/XgGwL8iUwHIOOMNwmH/giphy.gif); background-size: contain; background-repeat: no-repeat; font-size: 60px;color: black; font-weight: bold; font-style: italic; font-family: serif; text-shadow: 3px 3px 0 rgb(245,221,8)"
    );

    ui.setWindowSize();
    // notifications.initialize(toaster);
  }, [ui, notifications]);

  return (
    <Suspense
      fallback={
        <Flex my={10} align="center" justify="center">
          <Spinner />
        </Flex>
      }
    >
      <Router>
        <ChakraProvider theme={customTheme}>
          <CSSReset />

          <AppLoader>
            <Header />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/subjects" component={Subjects} />
              <Route path="/vote" component={Vote} />
            </Switch>
          </AppLoader>
        </ChakraProvider>
      </Router>
    </Suspense>
  );
}
