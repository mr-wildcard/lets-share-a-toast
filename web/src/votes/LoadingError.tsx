import React, { FunctionComponent } from "react";

import { LoadingState } from "./types";

interface Props {
  error: LoadingState;
}

const LoadingError: FunctionComponent<Props> = ({ error }) => {
  return (
    <>
      {error === LoadingState.ERROR_NO_SESSION && "La session n'existe pas!"}
      {error === LoadingState.ERROR_WRONG_SESSION_STATUS &&
        "Ce n'est pas le moment de voter!"}
      {error === LoadingState.ERROR_UNKNOWN_ERROR &&
        "Une erreur inconnue s'est produite... 🤔"}
    </>
  );
};

export default LoadingError;
