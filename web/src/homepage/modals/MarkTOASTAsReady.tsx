import firebase from "firebase/app";
import React, { FunctionComponent, useRef } from "react";
import {
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
import { ToastStatus } from "@shared/enums";

import { DatabaseRefPaths } from "@shared/firebase";
import { pageColors } from "@web/core/constants";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import { getTOASTIsReadySlackMessage } from "@web/homepage/helpers";
import slackNotificationFieldsAreValid from "@web/core/helpers/form/validateSlackNotificationFields";
import SlackNotificationFieldsValues from "@web/core/models/form/SlackNotificationFieldsValues";

interface FormErrors {
  notificationMessage?: boolean;
}

type FormValues = SlackNotificationFieldsValues;

interface Props {
  isOpen: boolean;
  currentToast: Toast;
  closeModal(): void;
}

const MarkTOASTAsReady: FunctionComponent<Props> = ({
  currentToast,
  isOpen,
  closeModal,
}) => {
  const cancelBtn = useRef() as React.MutableRefObject<HTMLButtonElement>;

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
                Mark TOAST as ready
              </HighlightedText>
              <Image
                position="absolute"
                width={92}
                height={110}
                right={0}
                bottom="-20px"
                src="https://media.giphy.com/media/XgGwL8iUwHIOOMNwmH/giphy.gif"
              />
            </Text>
          </ModalHeader>

          <Formik
            initialValues={{
              notifySlack: false,
              notificationMessage: getTOASTIsReadySlackMessage(currentToast),
            }}
            validate={(values: FormValues) => {
              const errors: FormErrors = {};

              if (!slackNotificationFieldsAreValid(values)) {
                errors.notificationMessage = true;
              }

              return errors;
            }}
            onSubmit={(values) => {
              /* TODO: Handle Slack
              const endpoint = values.notifySlack
                ? getAPIEndpointWithSlackNotification(
                    APIPaths.TOAST_CURRENT_STATUS,
                    values.notificationMessage
                  )
                : APIPaths.TOAST_CURRENT_STATUS;
              */

              return firebase
                .database()
                .ref(DatabaseRefPaths.CURRENT_TOAST)
                .child("status")
                .set(ToastStatus.WAITING_FOR_TOAST)
                .then(() => {
                  closeModal();
                });

              /* TODO: Handle notifications
              notifications.send(
                auth.profile,
                NotificationType.EDIT_TOAST_STATUS,
                {
                  status: ToastStatus.WAITING_FOR_TOAST,
                }
              );
              */
            }}
          >
            {({ values, isSubmitting, isValid }) => (
              <Form>
                <ModalBody>
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
                </ModalBody>

                <ModalFooter justifyContent="center">
                  <Button
                    isDisabled={!isValid}
                    type="submit"
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    loadingText="Saving..."
                    mx={2}
                  >
                    GO!
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
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default MarkTOASTAsReady;
