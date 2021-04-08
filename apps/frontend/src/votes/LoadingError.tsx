import React, { FunctionComponent } from 'react';

import { LoadingErrorCode } from './types';

interface Props {
  error: LoadingErrorCode;
}

const LoadingError: FunctionComponent<Props> = ({ error }) => {
  return (
    <>
      {error === LoadingErrorCode.NO_SESSION && "La session n'existe pas!"}
      {error === LoadingErrorCode.WRONG_SESSION_STATUS &&
        "Ce n'est pas le moment de voter!"}
      {error === LoadingErrorCode.UNKNOWN_ERROR &&
        "Une erreur inconnue s'est produite... 🤔"}
    </>
  );
};

export default LoadingError;
