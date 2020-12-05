import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/core';
import dynamic from 'next/dynamic';

import { Subject, User } from '@letsshareatoast/shared';

import { pageColors } from 'frontend/core/constants';

interface Props {
  allUsers: User[];
  isOpen: boolean;
  subject?: Subject;
  revalidateSubjects(): Promise<boolean>;
  closeForm(): void;
}

const Form = dynamic(
  () => import('./Form' /* webpackChunkName: "subject-form" */),
  {
    loading: function Loader() {
      const theme = C.useTheme();

      return (
        <C.DrawerContent justifyContent="center" alignItems="center">
          <C.Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor={theme.colors.gray['800']}
            color={pageColors.subjects}
            size="xl"
          />
        </C.DrawerContent>
      );
    },
  }
);

const SubjectForm: FunctionComponent<Props> = ({
  allUsers,
  subject,
  closeForm,
  revalidateSubjects,
  isOpen,
}) => {
  return (
    <C.Drawer
      isOpen={isOpen}
      onClose={closeForm}
      placement="right"
      size="xl"
      closeOnEsc={true}
    >
      <C.DrawerOverlay>
        <Form
          revalidateSubjects={revalidateSubjects}
          subject={subject}
          allUsers={allUsers}
          closeForm={closeForm}
        />
      </C.DrawerOverlay>
    </C.Drawer>
  );
};

export default SubjectForm;
