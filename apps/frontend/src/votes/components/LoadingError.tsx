import React, { FunctionComponent } from 'react';

import { LoadingErrorCode } from 'votes/types';

interface Props {
  error: LoadingErrorCode;
}

const LoadingError: FunctionComponent<Props> = ({ error }) => {
  return (
    <>
      {error === LoadingErrorCode.NO_SESSION && "La session n'existe pas!"}
      {error === LoadingErrorCode.WRONG_SESSION_STATUS &&
        "Ce n'est pas le moment de voter!"}
    </>
  );
};

export default LoadingError;
