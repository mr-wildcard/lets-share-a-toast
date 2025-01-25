import React, { FC, useMemo } from "react";
import { SimpleGrid } from "@chakra-ui/react";

import { Subject } from "@shared/models";

import SubjectItem from "./item/SubjectItem";
import SubjectAddButton from "./SubjectAddButton";

interface Props {
  subjects: Subject[];
  creatingSubject: boolean;
  onAddSubject(): void;
  onEditSubject(subject: Subject): void;
}

const SubjectsList: FC<Props> = ({
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
    <SimpleGrid columns={3} gap={4}>
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
