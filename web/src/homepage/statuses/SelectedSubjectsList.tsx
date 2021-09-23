import React, { Fragment, FunctionComponent } from "react";
import {
  Avatar,
  AvatarGroup,
  Flex,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";

import { Subject } from "@shared/models";

import getUserFullname from "@web/core/helpers/getUserFullname";
import FloralSeparator from "./FloralSeparator";

interface Props {
  selectedSubjects: Subject[];
}

const SelectedSubjectsList: FunctionComponent<Props> = ({
  selectedSubjects,
}) => {
  return (
    <List fontSize="lg" fontWeight="normal">
      {selectedSubjects.map((subject, index, arrayOfSubjects) => (
        <Fragment key={`subject-${subject.id}-${index}`}>
          <ListItem>
            <Flex direction="column" align="center">
              <AvatarGroup size="md">
                {subject.speakers.map((speaker) => {
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
              <Text mt={2} fontStyle="italic" fontWeight="bold">
                &quot;{subject.title}&quot;
              </Text>
              <Text>
                a&nbsp;
                <Text as="span" fontWeight="bold">
                  {subject.duration} min
                </Text>
                &nbsp;
                <Text as="span">talk by</Text>&nbsp;
                <Text as="span" fontWeight="bold">
                  {subject.speakers.map(getUserFullname).join(", ")}
                </Text>
                .
              </Text>
            </Flex>
          </ListItem>

          {index < arrayOfSubjects.length - 1 && (
            <Flex my={5} justify="center">
              <FloralSeparator />
            </Flex>
          )}
        </Fragment>
      ))}
    </List>
  );
};

export default SelectedSubjectsList;
