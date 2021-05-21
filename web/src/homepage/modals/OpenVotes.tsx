import firebase from "firebase/app";
import React, { FunctionComponent, useRef } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  FormControl,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik } from "formik";

import { Toast } from "@shared/models";
import { SubjectStatus, ToastStatus } from "@shared/enums";
import { DatabaseRefPaths } from "@shared/firebase";

import { firebaseData } from "@web/core/firebase/data";
import { pageColors, Pathnames } from "@web/core/constants";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import getAppURL from "@web/core/helpers/getAppURL";
import { getTOASTElapsedTimeSinceCreation } from "@web/core/helpers/timing";
import { SlackNotificationFieldsValues } from "@web/core/models/form/SlackNotificationFieldsValues";
import { validateSlackNotificationField } from "@web/core/helpers/form/validateSlackNotificationFields";

interface FormErrors {
  notificationMessage?: boolean;
}

type FormValues = SlackNotificationFieldsValues;

interface Props {
  isOpen: boolean;
  currentToast: Toast;
  closeModal(): void;
}

const OpenVotes: FunctionComponent<Props> = ({
  currentToast,
  isOpen,
  closeModal,
}) => {
  const cancelBtn = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const votingToastURL = getAppURL() + Pathnames.VOTING_SESSION;

  return (
    <Modal
      isCentered
      onClose={closeModal}
      isOpen={isOpen}
      initialFocusRef={cancelBtn}
      closeOnEsc={true}
      size="lg"
    >
      <ModalOverlay>
        <ModalContent borderRadius="3px">
          <ModalHeader textAlign="center">
            <Text position="relative">
              <HighlightedText bgColor={pageColors.homepage}>
                Open voting session !
              </HighlightedText>
              <Image
                position="absolute"
                right="-20px"
                bottom="-30px"
                width={100}
                height={100}
                src="https://media.giphy.com/media/QLREiT3pNpO2VPbGjj/giphy.gif"
              />
            </Text>
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                notifySlack: false,
                notificationMessage: `@here 🍞TOAST 🍞 Ladies and gentlemen, it's time to vote for your favorite subjects: ${votingToastURL}`,
              }}
              validate={(values: FormValues) => {
                const errors: FormErrors = {};

                if (!validateSlackNotificationField(values)) {
                  errors.notificationMessage = true;
                }

                return errors;
              }}
              onSubmit={async (values): Promise<void> => {
                // TODO: handle slack

                return firebase
                  .database()
                  .ref(DatabaseRefPaths.CURRENT_TOAST)
                  .child("status")
                  .set(ToastStatus.OPEN_FOR_VOTE)
                  .then(closeModal);
              }}
            >
              {({ values, isSubmitting, isValid }) => (
                <Form>
                  <Box>
                    <Box my={5}>
                      <Alert status="warning" variant="left-accent">
                        <Box flex={1}>
                          <AlertTitle textDecoration="underline">
                            TOAST has been created&nbsp;
                            {getTOASTElapsedTimeSinceCreation(
                              new Date(currentToast.createdDate)
                            )}
                            .
                          </AlertTitle>
                          <AlertDescription>
                            Be sure that people had enough time to manage their
                            subject(s) before opening votes!
                            <br />
                            <Text as="span" fontWeight="bold">
                              {
                                firebaseData.subjects.filter(
                                  (subject) =>
                                    subject.status === SubjectStatus.AVAILABLE
                                ).length
                              }
                            </Text>
                            &nbsp;available subjects will be added to the voting
                            session.
                          </AlertDescription>
                        </Box>
                      </Alert>
                    </Box>

                    <Box>
                      <Field name="notifySlack">
                        {({ field }: FieldProps) => (
                          <Checkbox mb={2} defaultIsChecked={false} {...field}>
                            Also notify #bordeaux Slack channel:
                          </Checkbox>
                        )}
                      </Field>

                      <Field name="notificationMessage">
                        {({ field, meta }: FieldProps) => (
                          <FormControl>
                            <Textarea
                              {...field}
                              height="150px"
                              isRequired={values.notifySlack}
                              isDisabled={!values.notifySlack}
                              isInvalid={meta.touched && !!meta.error}
                              value={values.notificationMessage}
                            />
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                  </Box>

                  <ModalFooter justifyContent="center">
                    <Button
                      isDisabled={!isValid}
                      type="submit"
                      colorScheme="blue"
                      isLoading={isSubmitting}
                      loadingText="Opening votes..."
                      mx={2}
                    >
                      Open votes!
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
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default OpenVotes;
