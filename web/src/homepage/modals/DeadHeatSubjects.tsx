import React, { FunctionComponent, useEffect, useMemo, useRef } from "react";
import * as C from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik, FormikProps } from "formik";
import { toJS } from "mobx";

import { Toast, Subject } from "@shared/models";
import { ToastStatus } from "@shared/enums";
import { DatabaseVotingSession } from "@shared/firebase";

import { pageColors } from "@web/core/constants";
import NotificationType from "@web/notifications/types/NotificationType";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import getUserFullname from "@web/core/helpers/getUserFullname";
import useStores from "@web/core/hooks/useStores";

interface FormErrors {
  selectedSubjectsIds?: boolean;
}

interface FormValues {
  selectedSubjectsIds: string[];
}

interface Props {
  isOpen: boolean;
  currentToast: Toast;
  closeModal(): void;
}

export function DeadHeatSubjectsModal({
  currentToast,
  isOpen,
  closeModal,
}: Props) {
  const cancelBtn = useRef() as React.MutableRefObject<HTMLButtonElement>;

  /**
   * Sort selected subjects by their total amout of votes.
   */
  const sortedSelectedSubjects: Subject[] = useMemo(() => {
    return currentToast.selectedSubjects.sort(
      (selectedSubject1, selectedSubject2) => {
        return (
          currentToast.votes![selectedSubject2.id] -
          currentToast.votes![selectedSubject1.id]
        );
      }
    );
  }, [currentToast]);

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
        <Formik
          validateOnMount={true}
          initialValues={{
            selectedSubjectsIds: [],
          }}
          validate={(values: FormValues): FormErrors => {
            const errors: FormErrors = {};

            if (
              values.selectedSubjectsIds.length <
              currentToast.maxSelectableSubjects
            ) {
              errors.selectedSubjectsIds = true;
            }

            return errors;
          }}
          onSubmit={async (values: FormValues): Promise<void> => {
            const request = http();

            console.log("Dead heat subjects", { values });

            await request(APIPaths.TOAST_CURRENT_SELECTED_SUBJECT, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                selectedSubjectsIds: values.selectedSubjectsIds,
              }),
            });

            await request(APIPaths.TOAST_CURRENT_STATUS, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: ToastStatus.WAITING_FOR_TOAST,
              }),
            });

            /* TODO: activate notifications
            notifications.send(
              // @ts-ignore
              auth.profile,
              NotificationType.EDIT_TOAST_STATUS,
              {
                status: ToastStatus.WAITING_FOR_TOAST,
              }
            );
            */

            closeModal();
          }}
        >
          {({
            values,
            isSubmitting,
            isValid,
            validateForm,
          }: FormikProps<FormValues>) => {
            const remainingSubjectsToSelect =
              currentToast.maxSelectableSubjects -
              values.selectedSubjectsIds.length;

            return (
              <Form>
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
                            The following subjects ended up with the same amout
                            of votes. You need to chose a total of&nbsp;
                            <C.Text as="span" fontWeight="bold">
                              {currentToast.maxSelectableSubjects}
                            </C.Text>
                            &nbsp;subjects in order to proceed.
                          </C.AlertDescription>
                        </C.Box>
                      </C.Alert>
                    </C.Box>

                    <C.Divider />

                    <C.Box mt={5}>
                      <Field name="selectedSubjectsIds">
                        {({ field, form }: FieldProps) => (
                          <C.Stack
                            spacing={3}
                            px={5}
                            maxHeight="40vh"
                            overflowY="auto"
                          >
                            {sortedSelectedSubjects.map((subject) => {
                              const subjectIsSelected = values.selectedSubjectsIds.includes(
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
                                    subjectIsSelected ? "white" : "gray.600"
                                  }
                                  backgroundColor={
                                    subjectIsSelected ? "green.500" : "white"
                                  }
                                  boxShadow={subjectIsSelected ? "none" : "sm"}
                                  cursor="pointer"
                                  onClick={() => {
                                    if (subjectIsSelected) {
                                      /**
                                       * Remove subject from selected subjects.
                                       */
                                      form.setFieldValue(
                                        field.name,
                                        values.selectedSubjectsIds.filter(
                                          (selectedSubjectId) =>
                                            selectedSubjectId !== subject.id
                                        )
                                      );
                                    } else {
                                      if (
                                        values.selectedSubjectsIds.length ===
                                        currentToast.maxSelectableSubjects
                                      ) {
                                        /**
                                         * Unselect the oldest selected subject and
                                         * mark this subject as selected.
                                         * So that we never select more subjects than needed.
                                         */
                                        const [
                                          ,
                                          ...restOfSelectedSubjectIds
                                        ] = values.selectedSubjectsIds;

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
                                          values.selectedSubjectsIds.concat(
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
                                      .join(", ")}
                                  </C.Text>
                                  <C.Text textAlign="right">
                                    Votes: {currentToast.votes[subject.id]}
                                  </C.Text>
                                </C.Box>
                              );
                            })}
                          </C.Stack>
                        )}
                      </Field>
                    </C.Box>
                  </C.ModalBody>
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
                          remainingSubjectsToSelect > 1 ? "s" : ""
                        }`}

                      {isValid && "Save selected subjects"}
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
                      Do nothing
                    </C.Button>
                  </C.ModalFooter>
                </C.ModalContent>
              </Form>
            );
          }}
        </Formik>
      </C.ModalOverlay>
    </C.Modal>
  );
}
