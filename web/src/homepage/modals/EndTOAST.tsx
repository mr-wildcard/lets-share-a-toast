import firebase from "firebase/app";
import React, { ChangeEvent, FunctionComponent, useRef, useState } from "react";
import * as C from "@chakra-ui/react";
import { Form, Formik, Field, FormikProps, FieldProps } from "formik";

import { Toast } from "@shared/models";
import { ToastStatus } from "@shared/enums";
import { DatabaseRefPaths } from "@shared/firebase";

import { pageColors } from "@web/core/constants";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import getUserFullname from "@web/core/helpers/getUserFullname";

interface FormErrors {
  givenSubjectsIds?: boolean;
}

interface FormValues {
  givenSubjectsIds: string[];
}

interface Props {
  isOpen: boolean;
  currentToast: Toast;
  closeModal(): void;
}

const EndTOAST: FunctionComponent<Props> = ({
  currentToast,
  isOpen,
  closeModal,
}) => {
  const [endingTOAST, setEndingTOAST] = useState(false);

  const cancelBtn = useRef() as React.MutableRefObject<HTMLButtonElement>;

  return (
    <C.Modal
      isCentered
      isOpen={isOpen}
      initialFocusRef={cancelBtn}
      onClose={closeModal}
      size="xl"
    >
      <C.ModalOverlay>
        <Formik
          validateOnMount={true}
          initialValues={{
            givenSubjectsIds: [],
          }}
          validate={(values: FormValues): FormErrors => {
            const errors: FormErrors = {};

            if (!values.givenSubjectsIds.length) {
              errors.givenSubjectsIds = true;
            }

            return errors;
          }}
          onSubmit={async (values: FormValues): Promise<void> => {
            return firebase
              .database()
              .ref(DatabaseRefPaths.CURRENT_TOAST)
              .child("status")
              .set(ToastStatus.CLOSED)
              .then(() => {
                closeModal();
              });

            /*
              notifications.send(
                auth.profile,
                NotificationType.EDIT_TOAST_STATUS,
                {
                  status: ToastStatus.CLOSED,
                }
              );
              */
          }}
        >
          {({
            values,
            isValid,
            isSubmitting,
            errors,
          }: FormikProps<FormValues>) => {
            return (
              <Form>
                <C.ModalContent borderRadius="3px">
                  <C.ModalHeader textAlign="center">
                    <C.Text position="relative" pr={5}>
                      <HighlightedText bgColor={pageColors.homepage}>
                        End current TOAST
                      </HighlightedText>
                      <Image
                        position="absolute"
                        right={0}
                        bottom="-5px"
                        width={120}
                        height={120}
                        src="https://media.giphy.com/media/RLVLZDCYkjrdwlUQSt/giphy.webp"
                      />
                    </C.Text>
                  </C.ModalHeader>
                  <C.AlertDialogBody fontSize="lg">
                    <C.Box mb={5}>
                      <C.Alert status="info" variant="left-accent">
                        <C.Box flex={1}>
                          <C.AlertDescription>
                            In order to end the TOAST, you need to specify which
                            subject(s) has been given. (at least one subject).
                            <br />
                            If no subject has been given, you might want to
                            cancel the TOAST instead.
                          </C.AlertDescription>
                        </C.Box>
                      </C.Alert>
                    </C.Box>

                    <C.Divider my={5} />

                    <C.Stack my={10} spacing={5}>
                      {currentToast.selectedSubjects!.map(
                        (selectedSubject, index) => {
                          const subjectIsSelected = values.givenSubjectsIds.includes(
                            selectedSubject.id
                          );

                          return (
                            <Field
                              key={`${selectedSubject.id}-${index}`}
                              name="givenSubjectsIds"
                            >
                              {({
                                field,
                                form,
                              }: FieldProps<
                                FormValues["givenSubjectsIds"],
                                FormValues
                              >) => (
                                <C.Box
                                  as="button"
                                  type="button"
                                  key={`subject-${selectedSubject.id}`}
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
                                    if (
                                      values.givenSubjectsIds.includes(
                                        selectedSubject.id
                                      )
                                    ) {
                                      form.setFieldValue(
                                        field.name,
                                        field.value.filter(
                                          (subjectId: string) =>
                                            subjectId !== selectedSubject.id
                                        )
                                      );
                                    } else {
                                      form.setFieldValue(
                                        field.name,
                                        field.value.concat(selectedSubject.id)
                                      );
                                    }
                                  }}
                                >
                                  <C.Text
                                    as="span"
                                    fontWeight="bold"
                                    fontStyle="italic"
                                  >
                                    "{selectedSubject.title}"
                                  </C.Text>
                                  &nbsp;by&nbsp;
                                  {selectedSubject.speakers
                                    .map(getUserFullname)
                                    .join(", ")}
                                </C.Box>
                              )}
                            </Field>
                          );
                        }
                      )}
                    </C.Stack>
                  </C.AlertDialogBody>
                  <C.AlertDialogFooter justifyContent="center">
                    <C.Stack spacing={3} direction="row">
                      <C.Button
                        type="submit"
                        isLoading={isSubmitting}
                        isDisabled={isSubmitting || !isValid}
                        loadingText="Ending TOAST..."
                        colorScheme="green"
                      >
                        I do want to end the TOAST
                      </C.Button>
                      <C.Button
                        position="relative"
                        overflow="hidden"
                        ref={cancelBtn}
                        onClick={closeModal}
                      >
                        Do nothing
                      </C.Button>
                    </C.Stack>
                  </C.AlertDialogFooter>
                </C.ModalContent>
              </Form>
            );
          }}
        </Formik>
      </C.ModalOverlay>
    </C.Modal>
  );
};

export default EndTOAST;
