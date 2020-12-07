import React, { FunctionComponent, useMemo } from 'react';
import * as C from '@chakra-ui/react';

import { Subject, SubjectStatus } from '@letsshareatoast/shared';

import { isSubjectNew } from 'frontend/subjects/helpers';
import SubjectStatusBadge from 'frontend/subjects/components/list/item/SubjectStatusBadge';
import SubjectLanguageBadge from 'frontend/subjects/components/list/item/SubjectLanguageBadge';
import SubjectDurationBadge from 'frontend/subjects/components/list/item/SubjectDurationBadge';
import SubjectNewBadge from 'frontend/subjects/components/list/item/SubjectNewBadge';

interface Props {
  subject: Subject;
}

const SubjectInfoBadges: FunctionComponent<Props> = ({ subject }) => {
  const subjectIsNew = useMemo(() => {
    return isSubjectNew(subject.createdDate);
  }, [subject]);

  return (
    <C.Flex align="center">
      {subjectIsNew && subject.status !== SubjectStatus.DONE && (
        <>
          <SubjectNewBadge />
          <C.Box as="span" px={2}>
            &bull;
          </C.Box>
        </>
      )}

      <SubjectStatusBadge status={subject.status} />
      <C.Box as="span" px={2}>
        &bull;
      </C.Box>
      <SubjectLanguageBadge language={subject.language} />
      <C.Box as="span" px={2}>
        &bull;
      </C.Box>
      <SubjectDurationBadge duration={subject.duration} />
    </C.Flex>
  );
};

export default SubjectInfoBadges;
