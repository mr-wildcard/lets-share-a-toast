import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useRef,
  useState,
} from "react";
import * as C from "@chakra-ui/react";
import { Form, Formik, Field, FormikProps, FieldProps } from "formik";

import { Toast } from "@shared/models";
import { ToastStatus, SubjectStatus } from "@shared/enums";

import http from "@web/core/httpClient";
import { APIPaths, pageColors } from "@web/core/constants";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import NotificationType from "@web/notifications/types/NotificationType";
import useStores from "@web/core/hooks/useStores";
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
  const { auth, notifications } = useStores();

  const [endingTOAST, setEndingTOAST] = useState(false);

  const cancelBtn = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const endTOAST = useCallback(async (): Promise<void> => {
    setEndingTOAST(true);
  }, [closeModal, currentToast.id, notifications, auth.profile]);

  return (
    <C.AlertDialog
      isCentered
      isOpen={isOpen}
      leastDestructiveRef={cancelBtn}
      onClose={closeModal}
      size="lg"
    >
      <C.AlertDialogOverlay>
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
            const getRequest = () => http();

            try {
              const updateTOASTUpdateRequest = getRequest();

              await updateTOASTUpdateRequest(APIPaths.TOAST_CURRENT_STATUS, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  status: ToastStatus.CLOSED,
                }),
              });

              await Promise.all(
                values.givenSubjectsIds.map((givenSubjectsId) => {
                  const changeSubjectRequest = getRequest();

                  return changeSubjectRequest(
                    APIPaths.SUBJECT_STATUS.replace(":id", givenSubjectsId),
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        status: SubjectStatus.DONE,
                      }),
                    }
                  );
                })
              );

              notifications.send(
                // @ts-ignore
                auth.profile,
                NotificationType.EDIT_TOAST_STATUS,
                {
                  status: ToastStatus.CLOSED,
                }
              );

              closeModal();
            } catch (error) {
              console.log("An error occured while ending TOAST", { error });

              setEndingTOAST(false);
            }
          }}
        >
          {({ values, isValid, errors }: FormikProps<FormValues>) => {
            return (
              <Form>
                <C.AlertDialogContent borderRadius="3px">
                  <C.AlertDialogHeader textAlign="center">
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
                  </C.AlertDialogHeader>
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
                      {currentToast.selectedSubjects.map(
                        (selectedSubject, index) => {
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
                                <C.Checkbox
                                  alignItems="start"
                                  size="lg"
                                  onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                  ) => {
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
                                  isChecked={values.givenSubjectsIds.includes(
                                    selectedSubject.id
                                  )}
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
                                </C.Checkbox>
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
                        isLoading={endingTOAST}
                        isDisabled={endingTOAST || !isValid}
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
                </C.AlertDialogContent>
              </Form>
            );
          }}
        </Formik>
      </C.AlertDialogOverlay>
    </C.AlertDialog>
  );
};

export default EndTOAST;
