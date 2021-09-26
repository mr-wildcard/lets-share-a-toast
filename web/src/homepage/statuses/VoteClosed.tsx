import { observer } from "mobx-react-lite";
import React, { FunctionComponent } from "react";
import { Box, Text } from "@chakra-ui/react";

import { Toast } from "@shared/models";

import { getTOASTElapsedTimeSinceCreation } from "@web/core/helpers/timing";
import Image from "@web/core/components/Image";
import toastHasDeadheatSubjects from "@web/core/helpers/toastHasDeadheatSubjects";
import WhosInChargeRecap from "web/src/homepage/statuses/components/WhosInChargeRecap";

interface Props {
  toast: Toast;
}

const VotesClosed: FunctionComponent<Props> = ({ toast }) => {
  return (
    <Box fontWeight="bold" color="gray.800" textAlign="center">
      <Text fontSize="4xl" mt={0} mb={5}>
        TOAST is coming&nbsp;
        {getTOASTElapsedTimeSinceCreation(toast.date)} !
      </Text>

      <Box my={5}>
        <WhosInChargeRecap toast={toast} />
      </Box>

      {toastHasDeadheatSubjects(toast) && (
        <Box my={5}>
          <Image
            mx="auto"
            mb={3}
            width={100}
            height={100}
            src="https://media.giphy.com/media/Ve5vfhwsox2G3bJ44O/giphy.gif"
          />
          <Text fontSize="lg">
            Voting session ended with more than {toast.maxSelectableSubjects}
            &nbsp;subjects. <br />
            Go to TOAST management below to settle this.
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default observer(VotesClosed);
