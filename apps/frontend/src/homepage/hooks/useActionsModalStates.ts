import * as C from '@chakra-ui/react';

const useActionsModalStates = () => {
  const toast = C.useDisclosure();
  const cancelTOAST = C.useDisclosure();
  const openVotes = C.useDisclosure();
  const closeVotes = C.useDisclosure();
  const markTOASTAsReady = C.useDisclosure();
  const deadHeatSubjects = C.useDisclosure();
  const endTOAST = C.useDisclosure();

  return {
    toast,
    cancelTOAST,
    openVotes,
    closeVotes,
    markTOASTAsReady,
    deadHeatSubjects,
    endTOAST,
  };
};

export default useActionsModalStates;
