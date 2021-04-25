import React, { FunctionComponent, useMemo } from "react";
import * as C from "@chakra-ui/react";

import { CurrentToast } from "@shared/models";
import { ToastStatus } from "@shared/enums";

import isToast from "@web/core/helpers/isToast";
import { hasTOASTDatePassed, isTOASTToday } from "@web/core/helpers/timing";
import useStores from "@web/core/hooks/useStores";

const lazyLoadConfig = {
  loading: function Loader() {
    const theme = C.useTheme();

    return (
      <C.Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor={theme.colors.gray["800"]}
        color={theme.colors.orange["300"]}
        size="xl"
      />
    );
  },
};

const NoTOAST = React.lazy(
  () => import("./statuses/NoTOAST" /* webpackChunkName: "status-no-toast" */)
);

const TOASTIsToday = React.lazy(
  () =>
    import(
      "./statuses/TOASTIsToday" /* webpackChunkName: "status-toast-today" */
    )
);

const TOASTDateHasPassed = React.lazy(
  () =>
    import(
      "./statuses/TOASTDateHasPassed" /* webpackChunkName: "status-toast-date-passed" */
    )
);

const OpenForContributions = React.lazy(
  () =>
    import(
      "./statuses/OpenForContributions" /* webpackChunkName: "status-open-for-contribution" */
    )
);

const OpenForVotes = React.lazy(
  () =>
    import(
      "./statuses/OpenForVotes" /* webpackChunkName: "status-open-for-votes" */
    )
);

const VoteClosed = React.lazy(
  () =>
    import("./statuses/VoteClosed" /* webpackChunkName: "status-vote-closed" */)
);

const WaitingForTOAST = React.lazy(
  () =>
    import(
      "./statuses/WaitingForTOAST" /* webpackChunkName: "status-waiting-for-toast" */
    )
);

interface Props {
  currentToast: CurrentToast;
}

const TOASTStatus: FunctionComponent<Props> = ({ currentToast }) => {
  const toastIsToday = useMemo(() => {
    return isToast(currentToast) && isTOASTToday(new Date(currentToast.date));
  }, [currentToast]);

  const toastDateHasPassed = useMemo(() => {
    return (
      isToast(currentToast) && hasTOASTDatePassed(new Date(currentToast.date))
    );
  }, [currentToast]);

  return (
    <>
      {!isToast(currentToast) && <NoTOAST />}

      {isToast(currentToast) && (
        <>
          {toastDateHasPassed && <TOASTDateHasPassed toast={currentToast} />}

          {toastIsToday && <TOASTIsToday toast={currentToast} />}

          {!toastIsToday && !toastDateHasPassed && (
            <>
              {currentToast.status === ToastStatus.OPEN_TO_CONTRIBUTION && (
                <OpenForContributions toast={currentToast} />
              )}

              {currentToast.status === ToastStatus.OPEN_FOR_VOTE && (
                <OpenForVotes toast={currentToast} />
              )}

              {currentToast.status === ToastStatus.WAITING_FOR_TOAST && (
                <WaitingForTOAST toast={currentToast} />
              )}

              {currentToast.status === ToastStatus.VOTE_CLOSED && (
                <VoteClosed toast={currentToast} />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default TOASTStatus;
