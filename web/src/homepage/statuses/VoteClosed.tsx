import { observer } from "mobx-react-lite";
import React, { FunctionComponent } from "react";
import * as C from "@chakra-ui/react";

import { Toast } from "@shared/models";

import { getTOASTElapsedTimeSinceCreation } from "@web/core/helpers/timing";
import Image from "@web/core/components/Image";
import toastHasDeadheatSubjects from "@web/core/helpers/toastHasDeadheatSubjects";
import ProposeSubjectForNextTOASTButton from "@web/homepage/statuses/ProposeSubjectForNextTOASTButton";
import WhosInChargeRecap from "./WhosInChargeRecap";

interface Props {
  toast: Toast;
}

const VotesClosed: FunctionComponent<Props> = observer(({ toast }) => {
  return (
    <C.Box fontWeight="bold" color="gray.800" textAlign="center">
      <C.Text fontSize="4xl" mt={0} mb={5}>
        TOAST is coming&nbsp;
        {getTOASTElapsedTimeSinceCreation(toast.date)} !
      </C.Text>

      <C.Box my={5}>
        <WhosInChargeRecap toast={toast} />
      </C.Box>

      {toastHasDeadheatSubjects(toast) && (
        <C.Box my={5}>
          <Image
            mx="auto"
            mb={3}
            width={100}
            height={100}
            src="https://media.giphy.com/media/Ve5vfhwsox2G3bJ44O/giphy.gif"
          />
          <C.Text fontSize="lg">
            Voting session ended with more than {toast.maxSelectableSubjects}
            &nbsp; subjects. <br />
            Go to TOAST management below to settle this.
          </C.Text>
        </C.Box>
      )}

      {!toastHasDeadheatSubjects(toast) && (
        <C.Box mt={5}>
          <ProposeSubjectForNextTOASTButton />
        </C.Box>
      )}
    </C.Box>
  );
});

export default VotesClosed;
