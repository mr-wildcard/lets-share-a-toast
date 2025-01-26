import React, { FC, useMemo, useRef } from "react";
import {
  Alert,
  Box,
  Button,
  Separator,
  Heading,
  Dialog,
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

const resolveDeadheatSubjects = getCloudFunctionResolveDeadHeatSubjects();

const DeadHeatSubjectsModal: FC<Props> = observer(
  ({ currentToast, closeModal }) => {
    const cancelBtn = useRef<HTMLButtonElement>(null);

    const votes = firebaseData.votingSession?.votes;

    const selectedSubjects = currentToast.selectedSubjects;

    /**
     * Find subjects which doesn't need to be settled
     * because they're the only ones to have this amount of votes
     */
    const alreadySettledSubjects = useMemo(() => {
      if (!votes) {
        return [];
      }

      const subjects: Subject[] = [];

      const allUniqueTotalVotes = getAllUniqueTotalVotes(votes);
      const subjectsByTotalVotes = getDictionaryOfSubjectPerTotalVotes(votes);

      for (let i = 0; i < allUniqueTotalVotes.length; i++) {
        const totalVotes = allUniqueTotalVotes[i];

        if (subjectsByTotalVotes[totalVotes].length === 1) {
          const [alreadySelectedSubjectId] = subjectsByTotalVotes[totalVotes];

          const subject = selectedSubjects.find(
            (selectedSubject) => selectedSubject.id === alreadySelectedSubjectId
          );

          if (subject) {
            subjects.push(subject);
          }
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
      <Dialog.Root
        placement="center"
        onOpenChange={closeModal}
        open={true}
        initialFocusEl={() => cancelBtn.current}
        closeOnEscape={true}
        scrollBehavior="inside"
        size="xl"
      >
        <Formik
          validateOnMount={true}
          initialValues={{
            selectedSubjectIds: [],
          }}
          validate={(values: FormValues): FormErrors => {
            const errors: FormErrors = {};

            if (
              alreadySettledSubjects.length + values.selectedSubjectIds.length <
              currentToast.maxSelectableSubjects
            ) {
              errors.selectedSubjectIds = true;
            }

            return errors;
          }}
          onSubmit={async (values: FormValues) => {
            return resolveDeadheatSubjects({
              selectedSubjectIds: alreadySettledSubjects
                .map((subject) => subject.id)
                .concat(values.selectedSubjectIds),
            }).then(closeModal);
          }}
        >
          {({ values, isSubmitting, isValid }: FormikProps<FormValues>) => {
            const remainingSubjectsToSelect =
              currentToast.maxSelectableSubjects -
              (alreadySettledSubjects.length +
                values.selectedSubjectIds.length);

            return (
              <Form>
                <Dialog.Content borderRadius="3px">
                  <Dialog.Header textAlign="center">
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
                  </Dialog.Header>
                  <Dialog.Body padding={0}>
                    <Box mb={5} px={5}>
                      <Alert.Root status="warning">
                        <Alert.Content flex={1}>
                          <Alert.Title>What&apos;s happening ?</Alert.Title>
                          <Alert.Description>
                            The following subjects ended up with the same amout
                            of votes. You need to chose a total of&nbsp;
                            <Text as="span" fontWeight="bold">
                              {currentToast.maxSelectableSubjects}
                            </Text>
                            &nbsp;subjects in order to proceed.
                          </Alert.Description>
                        </Alert.Content>
                      </Alert.Root>
                    </Box>

                    <Separator />

                    {alreadySettledSubjects.length > 0 && (
                      <Box m={5}>
                        <Heading as="h3" size="sm" mb={2}>
                          The following&nbsp;
                          {alreadySettledSubjects.length > 1
                            ? "subjects are"
                            : "subject is"}
                          &nbsp; already selected for the upcoming TOAST:
                        </Heading>
                        <Stack gap={3}>
                          {alreadySettledSubjects.map((subject) => {
                            const totalVotes = votes
                              ? getSubjectTotalVotes(votes[subject.id])
                              : 0;

                            return (
                              <SelectableSubject
                                key={subject.id}
                                subject={subject}
                                selected={true}
                                totalVotes={totalVotes}
                              />
                            );
                          })}
                        </Stack>

                        <Separator mt={5} />
                      </Box>
                    )}

                    <Box mt={5}>
                      <Field name="selectedSubjectIds">
                        {({ field, form }: FieldProps) => (
                          <Stack gap={3} px={5}>
                            {subjectsToSettle.map((subject) => {
                              const subjectIsSelected =
                                values.selectedSubjectIds.includes(subject.id);

                              const totalVotes = votes
                                ? getSubjectTotalVotes(votes[subject.id])
                                : 0;

                              return (
                                <SelectableSubject
                                  key={subject.id}
                                  subject={subject}
                                  selected={subjectIsSelected}
                                  totalVotes={totalVotes}
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
                                        const [, ...restOfSelectedSubjectIds] =
                                          values.selectedSubjectIds;

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
                  </Dialog.Body>
                  <Dialog.Footer justifyContent="center">
                    <Button
                      disabled={!isValid}
                      type="submit"
                      colorScheme="blue"
                      loading={isSubmitting}
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
                      disabled={isSubmitting}
                      onClick={closeModal}
                      type="button"
                      colorScheme="red"
                      variant="outline"
                      mx={2}
                    >
                      Do nothing
                    </Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Form>
            );
          }}
        </Formik>
      </Dialog.Root>
    );
  }
);

export { DeadHeatSubjectsModal };
