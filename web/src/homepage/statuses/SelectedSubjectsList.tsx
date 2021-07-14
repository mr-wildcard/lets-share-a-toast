import React, { FunctionComponent } from "react";
import { List, ListItem, Text } from "@chakra-ui/react";

import { Subject } from "@shared/models";

import getUserFullname from "@web/core/helpers/getUserFullname";

interface Props {
  selectedSubjects: Subject[];
}

const SelectedSubjectsList: FunctionComponent<Props> = ({
  selectedSubjects,
}) => {
  return (
    <List fontSize="lg" fontWeight="normal">
      {selectedSubjects.map((subject, index) => (
        <ListItem key={`subject-${subject.id}-${index}`}>
          &quot;
          <Text as="span" fontStyle="italic" fontWeight="bold">
            {subject.title}
          </Text>
          &quot;&nbsp;-&nbsp;<Text as="span">a</Text>&nbsp;
          <Text as="span" fontWeight="bold">
            {subject.duration} min
          </Text>
          &nbsp;
          <Text as="span">talk by</Text>&nbsp;
          <Text as="span" fontWeight="bold">
            {subject.speakers.map(getUserFullname).join(", ")}
          </Text>
          .
        </ListItem>
      ))}
    </List>
  );
};

export default SelectedSubjectsList;
