import React, { FunctionComponent, useMemo } from "react";
import * as C from "@chakra-ui/react";

import { User } from "@shared/models";

import getUserFullname from "@web/core/helpers/getUserFullname";

interface Props {
  speakers: User[];
}

const SubjectSpeakers: FunctionComponent<Props> = ({ speakers }) => {
  const namesList = useMemo(() => {
    return speakers.map(getUserFullname).join(", ");
  }, [speakers]);

  const highNumberOfSpeakers = speakers.length > 2;

  return (
    <C.Flex
      direction={highNumberOfSpeakers ? "column" : "row"}
      align={highNumberOfSpeakers ? "start" : "center"}
    >
      <C.AvatarGroup size="sm">
        {speakers.map((speaker, index) => {
          const fullname = getUserFullname(speaker);

          return (
            <C.Avatar
              key={`speaker-${index}-${speaker.uid}`}
              src={speaker.photoURL || undefined}
              name={fullname}
              title={fullname}
            />
          );
        })}
      </C.AvatarGroup>
      <C.Text fontStyle="italic">{namesList}</C.Text>
    </C.Flex>
  );
};

export default React.memo(SubjectSpeakers);
