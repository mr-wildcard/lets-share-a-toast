import React, { FunctionComponent, useMemo } from "react";
import { Avatar, AvatarGroup, Flex, Text } from "@chakra-ui/react";

import { User } from "@shared/models";

import getUserFullname from "@web/core/helpers/getUserFullname";
import { getSubjectSpeakersAsText } from "@web/core/helpers/getSubjectSpeakersAsText";

interface Props {
  speakers: User[];
}

const SubjectSpeakers: FunctionComponent<Props> = ({ speakers }) => {
  const namesList = useMemo(() => {
    return getSubjectSpeakersAsText(speakers);
  }, [speakers]);

  const highNumberOfSpeakers = speakers.length > 2;

  return (
    <Flex
      direction={highNumberOfSpeakers ? "column" : "row"}
      align={highNumberOfSpeakers ? "start" : "center"}
    >
      <AvatarGroup size="sm">
        {speakers.map((speaker, index) => {
          const fullname = getUserFullname(speaker);

          return (
            <Avatar
              key={`speaker-${index}-${speaker.id}`}
              src={speaker.photoURL || undefined}
              name={fullname}
              title={fullname}
            />
          );
        })}
      </AvatarGroup>
      <Text fontStyle="italic">{namesList}</Text>
    </Flex>
  );
};

export default React.memo(SubjectSpeakers);
