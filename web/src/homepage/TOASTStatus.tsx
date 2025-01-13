import React, { FC, Suspense } from "react";
import { observer } from "mobx-react-lite";
import { SkeletonText } from "@chakra-ui/react";

import { ToastStatus } from "@shared/enums";

import { hasTOASTDatePassed, isTOASTToday } from "@web/core/helpers/timing";
import { pageColors } from "@web/core/constants";
import { CurrentToast } from "@shared/models";

const NoTOAST = React.lazy(() => import("./statuses/NoTOAST"));
const TOASTIsToday = React.lazy(
  () => import("./statuses/components/TOASTIsToday")
);

const TOASTDateHasPassed = React.lazy(
  () => import("./statuses/components/TOASTDateHasPassed")
);

const OpenForContributions = React.lazy(
  () => import("./statuses/OpenForContributions")
);

const OpenForVotes = React.lazy(() => import("./statuses/OpenForVotes"));
const VoteClosed = React.lazy(() => import("./statuses/VoteClosed"));
const WaitingForTOAST = React.lazy(() => import("./statuses/WaitingForTOAST"));

interface Props {
  currentToast?: CurrentToast;
}

const TOASTStatus: FC<Props> = ({ currentToast }) => {
  const currentToastExists = !!currentToast;

  const toastIsToday = currentToastExists && isTOASTToday(currentToast.date);

  const toastDateHasPassed =
    currentToastExists && hasTOASTDatePassed(currentToast.date);

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
      {!currentToastExists && <NoTOAST />}

      {currentToastExists && (
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

              {currentToast.status === ToastStatus.VOTE_CLOSED && (
                <VoteClosed toast={currentToast} />
              )}

              {currentToast.status === ToastStatus.WAITING_FOR_TOAST && (
                <WaitingForTOAST toast={currentToast} />
              )}
            </>
          )}
        </>
      )}
    </Suspense>
  );
};

export default observer(TOASTStatus);
