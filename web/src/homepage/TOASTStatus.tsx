import React, { Suspense, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { SkeletonText, useTheme } from "@chakra-ui/react";

import { ToastStatus } from "@shared/enums";

import { firebaseData } from "@web/core/firebase/data";
import { hasTOASTDatePassed, isTOASTToday } from "@web/core/helpers/timing";
import { pageColors } from "@web/core/constants";

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

const TOASTStatus = () => {
  const theme = useTheme();

  const currentToast = firebaseData.currentToast;

  const toastIsToday = useMemo(() => {
    return !!currentToast && isTOASTToday(currentToast.date);
  }, [currentToast]);

  const toastDateHasPassed = useMemo(() => {
    return !!currentToast && hasTOASTDatePassed(currentToast.date);
  }, [currentToast]);

  return (
    <Suspense
      fallback={
        <SkeletonText
          w="30vw"
          skeletonHeight="20px"
          noOfLines={5}
          spacing="4"
          startColor={pageColors.homepage}
        />
      }
    >
      {currentToast === null && <NoTOAST />}

      {currentToast !== null && (
        <>
          {toastDateHasPassed && <TOASTDateHasPassed toast={currentToast!} />}

          {toastIsToday && <TOASTIsToday toast={currentToast!} />}

          {!toastIsToday && !toastDateHasPassed && (
            <>
              {currentToast!.status === ToastStatus.OPEN_TO_CONTRIBUTION && (
                <OpenForContributions toast={currentToast!} />
              )}

              {currentToast!.status === ToastStatus.OPEN_FOR_VOTE && (
                <OpenForVotes toast={currentToast!} />
              )}

              {currentToast!.status === ToastStatus.VOTE_CLOSED && (
                <VoteClosed toast={currentToast!} />
              )}

              {currentToast!.status === ToastStatus.WAITING_FOR_TOAST && (
                <WaitingForTOAST toast={currentToast!} />
              )}
            </>
          )}
        </>
      )}
    </Suspense>
  );
};

export default observer(TOASTStatus);
