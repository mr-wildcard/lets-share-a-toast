import React, { FunctionComponent, useMemo } from "react";
import * as C from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { Toast } from "@shared/models";

import firebase from "@web/core/firebase";
import getUserFullname from "@web/core/helpers/getUserFullname";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import { getFormattedTOASTDateWithRemainingDays } from "@web/core/helpers/timing";

interface Props {
  toast: Toast;
}

const WhosInChargeRecap: FunctionComponent<Props> = ({ toast }) => {
  const { users } = firebase;

  const organizer = useMemo(() => {
    return users.find((user) => user.id === toast.organizerId);
  }, [toast.organizerId]);

  const scribe = useMemo(() => {
    return users.find((user) => user.id === toast.scribeId);
  }, [toast.scribeId]);

  const organizerFullname = organizer
    ? getUserFullname(organizer)
    : "UNKNOWN_USER_" + toast.organizerId;

  const scribeFullname = scribe
    ? getUserFullname(scribe)
    : "UNKNOWN_USER_" + toast.scribeId;

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
          src={organizer?.photoURL}
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
          src={scribe?.photoURL}
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

export default observer(WhosInChargeRecap);
