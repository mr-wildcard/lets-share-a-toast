import React, { FunctionComponent } from "react";

import { PageDisplayState } from "./types";

interface Props {
  error: PageDisplayState;
}

const LoadingError: FunctionComponent<Props> = ({ error }) => {
  return (
    <>
      {error === PageDisplayState.ERROR_NO_TOAST && "La session n'existe pas!"}
      {error === PageDisplayState.ERROR_WRONG_TOAST_STATUS &&
        "Ce n'est pas le moment de voter!"}
      {error === PageDisplayState.ERROR_UNKNOWN_ERROR &&
        "Une erreur inconnue s'est produite... 🤔"}
    </>
  );
};

export default LoadingError;
