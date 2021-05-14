import React, { FunctionComponent } from "react";
import * as C from "@chakra-ui/react";

import { Subject, Toast } from "@shared/models";

import getUserFullname from "@web/core/helpers/getUserFullname";

interface Props {
  selectedSubjects: Subject[];
}

const SelectedSubjectsList: FunctionComponent<Props> = ({
  selectedSubjects,
}) => {
  return (
    <C.List fontSize="lg" fontWeight="normal">
      {/* TODO: handle selected subjects */}
      {selectedSubjects.map((subject, index) => (
        <C.ListItem key={`subject-${subject.id}-${index}`}>
          &quot;
          <C.Text as="span" fontStyle="italic" fontWeight="bold">
            {subject.title}
          </C.Text>
          &quot;&nbsp;-&nbsp;<C.Text as="span">a</C.Text>&nbsp;
          <C.Text as="span" fontWeight="bold">
            {subject.duration} min
          </C.Text>
          &nbsp;
          <C.Text as="span">talk by</C.Text>&nbsp;
          <C.Text as="span" fontWeight="bold">
            {subject.speakers.map(getUserFullname).join(", ")}
          </C.Text>
          .
        </C.ListItem>
      ))}
    </C.List>
  );
};

export default SelectedSubjectsList;
