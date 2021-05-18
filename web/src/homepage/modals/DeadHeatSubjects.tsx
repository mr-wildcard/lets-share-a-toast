import React, { useMemo, useRef } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Divider,
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
import firebase from "firebase/app";

import { Toast, Subject } from "@shared/models";
import { CloudFunctionName } from "@shared/firebase";

import { pageColors } from "@web/core/constants";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import getUserFullname from "@web/core/helpers/getUserFullname";

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
    return currentToast.selectedSubjects!.sort(
      (selectedSubject1, selectedSubject2) => {
        return (
          currentToast.votes![selectedSubject2.id] -
          currentToast.votes![selectedSubject1.id]
        );
      }
    );
  }, [currentToast]);

  return (
    <Modal
      isCentered
      onClose={closeModal}
      isOpen={isOpen}
      initialFocusRef={cancelBtn}
      closeOnEsc={true}
      size="xl"
    >
      <ModalOverlay>
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
          onSubmit={async (values: FormValues) => {
            return firebase
              .functions()
              .httpsCallable(CloudFunctionName.RESOLVE_DEADHEAT_SUBJECTS)({
                selectedSubjectsIds: values.selectedSubjectsIds,
              })
              .then(closeModal);
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
                        bottom="-44px"
                        src="https://media.giphy.com/media/XcMbKY8KIkXMJTLdse/giphy.gif"
                      />
                    </Text>
                  </ModalHeader>
                  <ModalBody p={0}>
                    <Box my={5} px={5}>
                      <Alert status="warning" variant="left-accent">
                        <Box flex={1}>
                          <AlertTitle>What&apos;s happening ?</AlertTitle>
                          <AlertDescription>
                            The following subjects ended up with the same amout
                            of votes. You need to chose a total of&nbsp;
                            <Text as="span" fontWeight="bold">
                              {currentToast.maxSelectableSubjects}
                            </Text>
                            &nbsp;subjects in order to proceed.
                          </AlertDescription>
                        </Box>
                      </Alert>
                    </Box>

                    <Divider />

                    <Box mt={5}>
                      <Field name="selectedSubjectsIds">
                        {({ field, form }: FieldProps) => (
                          <Stack
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
                                <Box
                                  as={Button}
                                  type="button"
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
                                  <Text fontSize="xl" fontWeight="bold">
                                    {subject.title}
                                  </Text>

                                  <Text>
                                    By:&nbsp;
                                    {subject.speakers
                                      .map(getUserFullname)
                                      .join(", ")}
                                  </Text>
                                  <Text textAlign="right">
                                    Votes: {currentToast.votes![subject.id]}
                                  </Text>
                                </Box>
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
