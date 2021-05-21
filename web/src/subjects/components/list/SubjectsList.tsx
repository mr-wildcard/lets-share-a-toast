import React, { FunctionComponent, useMemo } from "react";
import { Box } from "@chakra-ui/react";

import { Subject } from "@shared/models";

import SubjectItem from "./item/SubjectItem";
import SubjectAddButton from "./SubjectAddButton";

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
      <Box className="list-item">
        <SubjectAddButton
          onClick={onAddSubject}
          creatingSubject={creatingSubject}
        />
      </Box>
    );
  }, [creatingSubject, onAddSubject]);

  return (
    <Box>
      {subjects.length > 0
        ? subjects.map((subject, index) => (
            <React.Fragment key={`list-item-${index}`}>
              {index === 0 && subjectAddButton}

              <SubjectItem onEditSubject={onEditSubject} subject={subject} />
            </React.Fragment>
          ))
        : subjectAddButton}
    </Box>
  );
};

export default React.memo(SubjectsList);
