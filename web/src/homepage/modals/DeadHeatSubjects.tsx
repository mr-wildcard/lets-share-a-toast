import React, { FunctionComponent, useMemo, useRef } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Divider,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";

import { Toast, Subject } from "@shared/models";
import {
  getAllUniqueTotalVotes,
  getDictionaryOfSubjectPerTotalVotes,
  getSubjectTotalVotes,
} from "@shared/utils";

import { pageColors } from "@web/core/constants";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import { firebaseData } from "@web/core/firebase/data";
import { SelectableSubject } from "./deadHeatSubjects/SelectableSubject";
import { getCloudFunctionResolveDeadHeatSubjects } from "@web/core/firebase/helpers";

interface FormErrors {
  selectedSubjectIds?: boolean;
}

interface FormValues {
  selectedSubjectIds: string[];
}

interface Props {
  currentToast: Toast;
  closeModal(): void;
}

const DeadHeatSubjectsModal: FunctionComponent<Props> = observer(
  ({ currentToast, closeModal }) => {
    const cancelBtn = useRef() as React.MutableRefObject<HTMLButtonElement>;

    const votes = firebaseData.votingSession!.votes!;
    const selectedSubjects = currentToast.selectedSubjects;

    /**
     * Find subjects which doesn't need to be settled as they are the only ones
     * to get enough votes.
     */
    const alreadySettledSubjects = useMemo(() => {
      let subjects: Subject[] = [];

      const allUniqueTotalVotes = getAllUniqueTotalVotes(votes);
      const subjectsByTotalVotes = getDictionaryOfSubjectPerTotalVotes(votes);

      for (let i = 0; i < allUniqueTotalVotes.length; i++) {
        const totalVotes = allUniqueTotalVotes[i];

        if (subjectsByTotalVotes[totalVotes].length === 1) {
          const [alreadySelectedSubjectId] = subjectsByTotalVotes[totalVotes];

          const subject = selectedSubjects.find(
            (selectedSubject) => selectedSubject.id === alreadySelectedSubjectId
          );

          subjects.push(subject!);
        }
      }

      return subjects;
    }, [selectedSubjects, votes]);

    const subjectsToSettle = useMemo(() => {
      return selectedSubjects.filter(
        ({ id }) =>
          !alreadySettledSubjects.find(
            (settledSubject) => settledSubject.id === id
          )
      );
    }, [selectedSubjects, alreadySettledSubjects]);

    return (
      <Modal
        isCentered
        onClose={closeModal}
        isOpen={true}
        initialFocusRef={cancelBtn}
        closeOnEsc={true}
        scrollBehavior="inside"
        size="xl"
      >
        <ModalOverlay>
          <Formik
            validateOnMount={true}
            initialValues={{
              selectedSubjectIds: [],
            }}
            validate={(values: FormValues): FormErrors => {
              const errors: FormErrors = {};

              if (
                alreadySettledSubjects.length +
                  values.selectedSubjectIds.length <
                currentToast.maxSelectableSubjects
              ) {
                errors.selectedSubjectIds = true;
              }

              return errors;
            }}
            onSubmit={async (values: FormValues) => {
              const resolveDeadheatSubjects =
                getCloudFunctionResolveDeadHeatSubjects();

              return resolveDeadheatSubjects({
                selectedSubjectIds: alreadySettledSubjects
                  .map((subject) => subject.id)
                  .concat(values.selectedSubjectIds),
              }).then(closeModal);
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
                (alreadySettledSubjects.length +
                  values.selectedSubjectIds.length);

              return (
                <Form>
                  <ModalContent borderRadius="3px">
                    <ModalHeader textAlign="center">
                      <Text position="relative">
                        <HighlightedText bgColor={pageColors.homepage}>
                          Almost there...
                        </HighlightedText>
                        <Image
                          position="absolute"
                          width={147}
                          height={110}
                          right={0}
                          bottom="-16px"
                          src="https://media.giphy.com/media/XcMbKY8KIkXMJTLdse/giphy.gif"
                        />
                      </Text>
                    </ModalHeader>
                    <ModalBody p={0}>
                      <Box mb={5} px={5}>
                        <Alert status="warning" variant="left-accent">
                          <Box flex={1}>
                            <AlertTitle>What&apos;s happening ?</AlertTitle>
                            <AlertDescription>
                              The following subjects ended up with the same
                              amout of votes. You need to chose a total of&nbsp;
                              <Text as="span" fontWeight="bold">
                                {currentToast.maxSelectableSubjects}
                              </Text>
                              &nbsp;subjects in order to proceed.
                            </AlertDescription>
                          </Box>
                        </Alert>
                      </Box>

                      <Divider />

                      {alreadySettledSubjects.length > 0 && (
                        <Box m={5}>
                          <Heading as="h3" size="sm" mb={2}>
                            The following{" "}
                            {alreadySettledSubjects.length > 1
                              ? "subjects are"
                              : "subject is"}{" "}
                            already selected for the upcoming TOAST:
                          </Heading>
                          <Stack spacing={3}>
                            {alreadySettledSubjects.map((subject) => {
                              return (
                                <SelectableSubject
                                  key={subject.id}
                                  subject={subject}
                                  selected={true}
                                  totalVotes={getSubjectTotalVotes(
                                    votes[subject.id]
                                  )}
                                />
                              );
                            })}
                          </Stack>

                          <Divider mt={5} />
                        </Box>
                      )}

                      <Box mt={5}>
                        <Field name="selectedSubjectIds">
                          {({ field, form }: FieldProps) => (
                            <Stack spacing={3} px={5}>
                              {subjectsToSettle.map((subject) => {
                                const subjectIsSelected =
                                  values.selectedSubjectIds.includes(
                                    subject.id
                                  );

                                return (
                                  <SelectableSubject
                                    key={subject.id}
                                    subject={subject}
                                    selected={subjectIsSelected}
                                    totalVotes={getSubjectTotalVotes(
                                      votes[subject.id]
                                    )}
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
                                          alreadySettledSubjects.length +
                                            values.selectedSubjectIds.length >=
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
                                  />
                                );
                              })}
                            </Stack>
                          )}
                        </Field>
                      </Box>
                    </ModalBody>
                    <ModalFooter justifyContent="center">
                      <Button
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
                      </Button>
                      <Button
                        ref={cancelBtn}
                        isDisabled={isSubmitting}
                        onClick={closeModal}
                        type="button"
                        colorScheme="red"
                        variant="outline"
                        mx={2}
                      >
                        Do nothing
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Form>
              );
            }}
          </Formik>
        </ModalOverlay>
      </Modal>
    );
  }
);

export { DeadHeatSubjectsModal };
