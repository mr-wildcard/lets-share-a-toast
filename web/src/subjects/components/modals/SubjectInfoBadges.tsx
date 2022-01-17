import React, { FunctionComponent, useMemo } from "react";
import { Box, Flex } from "@chakra-ui/react";

import { SubjectStatus } from "@shared/enums";
import { Subject } from "@shared/models";

import { isSubjectNew } from "@web/subjects/helpers";
import SubjectStatusBadge from "@web/subjects/components/item/SubjectStatusBadge";
import SubjectLanguageBadge from "@web/subjects/components/item/SubjectLanguageBadge";
import SubjectDurationBadge from "@web/subjects/components/item/SubjectDurationBadge";
import SubjectNewBadge from "@web/subjects/components/item/SubjectNewBadge";

interface Props {
  subject: Subject;
}

const SubjectInfoBadges: FunctionComponent<Props> = ({ subject }) => {
  const subjectIsNew = useMemo(() => {
    return isSubjectNew(subject.createdDate);
  }, [subject]);

  return (
    <Flex align="center">
      {subjectIsNew && subject.status !== SubjectStatus.DONE && (
        <>
          <SubjectNewBadge />
          <Box as="span" px={2}>
            &bull;
          </Box>
        </>
      )}

      <SubjectStatusBadge status={subject.status} />
      <Box as="span" px={2}>
        &bull;
      </Box>
      <SubjectLanguageBadge language={subject.language} />
      <Box as="span" px={2}>
        &bull;
      </Box>
      <SubjectDurationBadge duration={subject.duration} />
    </Flex>
  );
};

export default SubjectInfoBadges;
