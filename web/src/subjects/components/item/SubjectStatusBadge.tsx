import React, { FC } from "react";
import { Badge } from "@chakra-ui/react";

import { SubjectStatus } from "@shared/enums";

interface Props {
  status: SubjectStatus;
}

const SubjectStatusBadge: FC<Props> = ({ status }) => (
  <>
    {status === SubjectStatus.AVAILABLE && (
      <Badge variant="solid" colorPalette="green" title="Available for a TOAST">
        Available
      </Badge>
    )}

    {status === SubjectStatus.SELECTED_FOR_NEXT_TOAST && (
      <Badge
        variant="solid"
        fontStyle="italic"
        colorPalette="blue"
        title="Selected for the next TOAST"
      >
        Selected for the next TOAST !
      </Badge>
    )}

    {status === SubjectStatus.UNAVAILABLE && (
      <Badge variant="solid" colorPalette="red">
        Unavailable
      </Badge>
    )}

    {status === SubjectStatus.DONE && (
      <Badge variant="solid">Already given</Badge>
    )}
  </>
);

export default SubjectStatusBadge;
