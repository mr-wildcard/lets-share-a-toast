import React, { FunctionComponent, useEffect, useRef } from 'react';
import * as C from '@chakra-ui/core';

import { Field, Form, Formik } from 'formik';
import { mutate } from 'swr';

import { ToastStatus, Toast } from '@letsshareatoast/shared';

import http from 'frontend/core/httpClient';
import {
  APIPaths,
  pageColors,
  TOTAL_NEEDED_SUBJECTS,
} from 'frontend/core/constants';
import NotificationType from 'notifications/types/NotificationType';
import HighlightedText from 'frontend/core/components/HighlightedText';
import Image from 'frontend/core/components/Image';
import getUserFullname from 'frontend/core/helpers/getUserFullname';
import useStores from 'frontend/core/hooks/useStores';

interface FormErrors {
  selectedSubjectIds?: boolean;
}

interface FormValues {
  selectedSubjectIds: string[];
}

interface Props {
  isOpen: boolean;
  currentToast: Toast;
  closeModal(): void;
}

const DeadHeatSubjects: FunctionComponent<Props> = ({
  currentToast,
  isOpen,
  closeModal,
}) => {
  const cancelBtn = useRef();

  const { notifications, auth } = useStores();

  return (
    <C.Modal
      isCentered
      onClose={closeModal}
      isOpen={isOpen}
      initialFocusRef={cancelBtn}
      closeOnEsc={true}
      size="lg"
    >
      <C.ModalOverlay>
        <C.ModalContent borderRadius="3px">
          <C.ModalHeader textAlign="center">
            <C.Text position="relative">
              <HighlightedText bgColor={pageColors.homepage}>
                Almost there...
              </HighlightedText>
              <Image
                position="absolute"
                width={147}
                height={110}
                right={0}
                bottom="-44px"
                src="https://media.giphy.com/media/XcMbKY8KIkXMJTLdse/giphy.gif"
              />
            </C.Text>
          </C.ModalHeader>
          <C.ModalBody p={0}>
            <C.Box my={5} px={5}>
              <C.Alert status="warning" variant="left-accent">
                <C.Box flex={1}>
                  <C.AlertTitle>What&apos;s happening ?</C.AlertTitle>
                  <C.AlertDescription>
                    The following subjects ended up with the same amout of
                    votes. You need to chose a total of&nbsp;
                    <C.Text as="span" fontWeight="bold">
                      {TOTAL_NEEDED_SUBJECTS}
                    </C.Text>
                    &nbsp;subjects in order to proceed.
                  </C.AlertDescription>
                </C.Box>
              </C.Alert>
            </C.Box>

            <C.Divider />

            <C.Box mt={5}>
              <Formik
                validateOnMount={true}
                initialValues={{
                  selectedSubjectIds: [],
                }}
                validate={(values): FormErrors => {
                  const errors: FormErrors = {};

                  if (
                    values.selectedSubjectIds.length < TOTAL_NEEDED_SUBJECTS
                  ) {
                    errors.selectedSubjectIds = true;
                  }

                  return errors;
                }}
                onSubmit={async (values): Promise<void> => {
                  const request = http();

                  console.log('Dead heat subjects', { values });

                  const updatedToast: Toast = await request(
                    `/toasts/${currentToast.id}/status`,
                    {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        status: ToastStatus.WAITING_FOR_TOAST,
                        // TODO: add selected subjects
                      }),
                    }
                  );

                  notifications.send(
                    auth.profile,
                    NotificationType.EDIT_TOAST_STATUS,
                    {
                      status: ToastStatus.WAITING_FOR_TOAST,
                    }
                  );

                  await mutate(APIPaths.CURRENT_TOAST, updatedToast);

                  closeModal();
                }}
              >
                {({ values, isSubmitting, isValid, validateForm }) => {
                  // https://github.com/formium/formik/issues/1950
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  useEffect(() => {
                    validateForm();
                  }, [validateForm]);

                  const remainingSubjectsToSelect =
                    TOTAL_NEEDED_SUBJECTS - values.selectedSubjectIds.length;

                  return (
                    <Form>
                      <Field name="selectedSubjectIds">
                        {({ field, form }) => (
                          <C.Stack
                            spacing={3}
                            px={5}
                            maxHeight="40vh"
                            overflowY="auto"
                          >
                            {/*
                             * TODO: list only subjects with same amount of votes.
                             * */}
                            {currentToast.subjects?.map((subject) => {
                              const subjectIsSelected = values.selectedSubjectIds.includes(
                                subject.id
                              );

                              return (
                                <C.Box
                                  key={`subject-${subject.id}`}
                                  p={3}
                                  borderRadius="md"
                                  borderWidth="1px"
                                  borderStyle="solid"
                                  borderColor="gray.200"
                                  color={
                                    subjectIsSelected ? 'white' : 'gray.600'
                                  }
                                  backgroundColor={
                                    subjectIsSelected ? 'green.500' : 'white'
                                  }
                                  boxShadow={subjectIsSelected ? 'none' : 'sm'}
                                  cursor="pointer"
                                  onClick={() => {
                                    if (subjectIsSelected) {
                                      /**
                                       * Remove subject from selected subjects.
                                       */
                                      form.setFieldValue(
                                        field.name,
                                        values.selectedSubjectIds.filter(
                                          (selectedSubjectId) =>
                                            selectedSubjectId !== subject.id
                                        )
                                      );
                                    } else {
                                      if (
                                        values.selectedSubjectIds.length ===
                                        TOTAL_NEEDED_SUBJECTS
                                      ) {
                                        /**
                                         * Unselect the oldest selected subject and
                                         * mark this subject as selected.
                                         * So that we never select more subjects than needed.
                                         */
                                        const [
                                          ,
                                          ...restOfSelectedSubjectIds
                                        ] = values.selectedSubjectIds;

                                        form.setFieldValue(
                                          field.name,
                                          restOfSelectedSubjectIds.concat(
                                            subject.id
                                          )
                                        );
                                      } else {
                                        /**
                                         * Add subject to selected subjects.
                                         */
                                        form.setFieldValue(
                                          field.name,
                                          values.selectedSubjectIds.concat(
                                            subject.id
                                          )
                                        );
                                      }
                                    }
                                  }}
                                >
                                  <C.Text fontSize="xl" fontWeight="bold">
                                    {subject.title}
                                  </C.Text>

                                  <C.Text>
                                    By:&nbsp;
                                    {subject.speakers
                                      .map(getUserFullname)
                                      .join(', ')}
                                  </C.Text>
                                  <C.Text textAlign="right">
                                    {/*
                                     * TODO: replace with real vote number
                                     */}
                                    Total votes : 1 millions
                                  </C.Text>
                                </C.Box>
                              );
                            })}
                          </C.Stack>
                        )}
                      </Field>

                      <C.ModalFooter justifyContent="center">
                        <C.Button
                          isDisabled={!isValid}
                          type="submit"
                          colorScheme="blue"
                          isLoading={isSubmitting}
                          loadingText="Saving subjects..."
                        >
                          {!isValid &&
                            `Select ${remainingSubjectsToSelect} more subject${
                              remainingSubjectsToSelect > 1 ? 's' : ''
                            }`}

                          {isValid && 'Save selected subjects'}
                        </C.Button>
                        <C.Button
                          ref={cancelBtn}
                          isDisabled={isSubmitting}
                          onClick={closeModal}
                          type="button"
                          colorScheme="red"
                          variant="outline"
                          mx={2}
                        >
                          Cancel
                        </C.Button>
                      </C.ModalFooter>
                    </Form>
                  );
                }}
              </Formik>
            </C.Box>
          </C.ModalBody>
        </C.ModalContent>
      </C.ModalOverlay>
    </C.Modal>
  );
};

export default DeadHeatSubjects;
