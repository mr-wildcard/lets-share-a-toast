import { observer } from "mobx-react-lite";
import React, { FunctionComponent } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

import { Toast } from "@shared/models";

import { getTOASTElapsedTimeSinceCreation } from "@web/core/helpers/timing";
import WhosInChargeRecap from "./WhosInChargeRecap";
import ProposeSubjectForNextTOASTButton from "./ProposeSubjectForNextTOASTButton";
import SelectedSubjectsList from "./SelectedSubjectsList";
import FloralSeparator from "./FloralSeparator";

interface Props {
  toast: Toast;
}

const WaitingForTOAST: FunctionComponent<Props> = ({ toast }) => {
  return (
    <Box fontWeight="bold" color="gray.800" textAlign="center">
      <Text fontSize="4xl" mt={0} mb={5}>
        TOAST is coming&nbsp;
        {getTOASTElapsedTimeSinceCreation(new Date(toast.date))} !
      </Text>

      <Box my={5}>
        <WhosInChargeRecap toast={toast} />
      </Box>

      <Text fontSize="lg" mb={3}>
        We&apos;ll have the pleasure to attend to the following talk
        {toast.selectedSubjects!.length > 1 ? "s" : ""}:
      </Text>

      <Flex align="center" direction="column">
        <SelectedSubjectsList selectedSubjects={toast.selectedSubjects!} />
      </Flex>
    </Box>
  );
};

export default observer(WaitingForTOAST);
