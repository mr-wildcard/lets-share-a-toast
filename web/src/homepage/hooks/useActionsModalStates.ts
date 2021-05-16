import { useDisclosure } from "@chakra-ui/react";

const useActionsModalStates = () => {
  const toast = useDisclosure();
  const cancelTOAST = useDisclosure();
  const openVotes = useDisclosure();
  const closeVotes = useDisclosure();
  const markTOASTAsReady = useDisclosure();
  const deadHeatSubjects = useDisclosure();
  const endTOAST = useDisclosure();

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
