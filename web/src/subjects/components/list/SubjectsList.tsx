import React, { FunctionComponent, useMemo } from "react";
import * as C from "@chakra-ui/react";

import { CurrentToast, Subject } from "@shared/models";

import MasonryGrid from "@web/subjects/components/list/MasonryGrid";
import SubjectItem from "./item/SubjectItem";
import SubjectAddButton from "./SubjectAddButton";

interface Props {
  subjects: Subject[];
  creatingSubject: boolean;
  onAddSubject(): void;
  revalidateSubjects(): Promise<boolean>;
  onEditSubject(subject: Subject): void;
}

const SubjectsList: FunctionComponent<Props> = ({
  subjects,
  creatingSubject,
  revalidateSubjects,
  onAddSubject,
  onEditSubject,
}) => {
  const subjectAddButton = useMemo(() => {
    return (
      <C.Box className="list-item">
        <SubjectAddButton
          onClick={onAddSubject}
          creatingSubject={creatingSubject}
        />
      </C.Box>
    );
  }, [creatingSubject, onAddSubject]);

  return subjects.length > 0 ? (
    <MasonryGrid>
      {subjects.map((subject, index) => (
        <React.Fragment key={`list-item-${index}`}>
          {index === 0 && subjectAddButton}

          <SubjectItem
            revalidateSubjects={revalidateSubjects}
            onEditSubject={onEditSubject}
            subject={subject}
          />
        </React.Fragment>
      ))}
    </MasonryGrid>
  ) : (
    <MasonryGrid>{subjectAddButton}</MasonryGrid>
  );
};

export default React.memo(SubjectsList);
