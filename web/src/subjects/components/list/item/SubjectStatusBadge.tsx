import React, { FunctionComponent } from "react";
import { Badge } from "@chakra-ui/react";

import { SubjectStatus } from "@shared/enums";

interface Props {
  status: SubjectStatus;
}

const SubjectStatusBadge: FunctionComponent<Props> = ({ status }) => (
  <>
    {status === SubjectStatus.AVAILABLE && (
      <Badge variant="solid" colorScheme="green" title="Available for a TOAST">
        Available
      </Badge>
    )}

    {status === SubjectStatus.SELECTED_FOR_NEXT_TOAST && (
      <Badge
        variant="solid"
        fontStyle="italic"
        colorScheme="blue"
        title="Selected for the next TOAST"
      >
        Selected for the next TOAST !
      </Badge>
    )}

    {status === SubjectStatus.UNAVAILABLE && (
      <Badge variant="solid" colorScheme="red">
        Unavailable
      </Badge>
    )}

    {status === SubjectStatus.DONE && (
      <Badge variant="solid">Already given</Badge>
    )}
  </>
);

export default SubjectStatusBadge;
