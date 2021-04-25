import React, { FunctionComponent } from "react";
import * as C from "@chakra-ui/react";

import { Toast } from "@shared/models";

import getUserFullname from "@web/core/helpers/getUserFullname";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import { getFormattedTOASTDateWithRemainingDays } from "@web/core/helpers/timing";

interface Props {
  toast: Toast;
}

const WhosInChargeRecap: FunctionComponent<Props> = ({ toast }) => {
  const organizerFullname = getUserFullname(toast.organizer);
  const scribeFullname = getUserFullname(toast.scribe);

  return (
    <C.Text fontSize="lg">
      Due date:&nbsp;
      <HighlightedText bgColor="orange.300">
        {getFormattedTOASTDateWithRemainingDays(new Date(toast.date))}
      </HighlightedText>
      <br />
      You can count on your host
      <HighlightedText mx={3} bgColor="orange.300">
        <Image
          d="inline-block"
          src={toast.organizer.picture}
          width={24}
          height={24}
          alt={organizerFullname}
          borderRadius="full"
          mr={2}
        />
        {organizerFullname}
      </HighlightedText>
      <br />
      and
      <HighlightedText mx={3} bgColor="orange.300">
        <Image
          d="inline-block"
          src={toast.scribe.picture}
          width={24}
          height={24}
          alt={scribeFullname}
          borderRadius="full"
          mr={2}
        />
        {scribeFullname}
      </HighlightedText>
      as the scribe.
    </C.Text>
  );
};

export default React.memo(WhosInChargeRecap);
