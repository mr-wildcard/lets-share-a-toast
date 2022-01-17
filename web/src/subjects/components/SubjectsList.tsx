import React, { FunctionComponent, useMemo } from "react";
import { SimpleGrid } from "@chakra-ui/react";

import { Subject } from "@shared/models";

import SubjectItem from "web/src/subjects/components/item/SubjectItem";
import SubjectAddButton from "web/src/subjects/components/SubjectAddButton";

interface Props {
  subjects: Subject[];
  creatingSubject: boolean;
  onAddSubject(): void;
  onEditSubject(subject: Subject): void;
}

const SubjectsList: FunctionComponent<Props> = ({
  subjects,
  creatingSubject,
  onAddSubject,
  onEditSubject,
}) => {
  const subjectAddButton = useMemo(() => {
    return (
      <SubjectAddButton
        onClick={onAddSubject}
        creatingSubject={creatingSubject}
      />
    );
  }, [creatingSubject, onAddSubject]);

  return (
    <SimpleGrid columns={3} spacing={4}>
      {subjectAddButton}

      {subjects.map((subject, index) => (
        <SubjectItem
          key={`subject-${subject.id}-${index}`}
          onEditSubject={onEditSubject}
          subject={subject}
        />
      ))}
    </SimpleGrid>
  );
};

export default SubjectsList;
