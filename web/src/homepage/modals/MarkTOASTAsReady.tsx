import firebase from "firebase/app";
import React, { FunctionComponent, useRef } from "react";
import * as C from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik } from "formik";

import { Toast } from "@shared/models";
import { ToastStatus } from "@shared/enums";

import { DatabaseRefPaths } from "@shared/firebase";
import { APIPaths, pageColors } from "@web/core/constants";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import { getTOASTIsReadySlackMessage } from "@web/homepage/helpers";
import http from "@web/core/httpClient";
import NotificationType from "@web/notifications/types/NotificationType";
import useStores from "@web/core/hooks/useStores";
import slackNotificationFieldsAreValid from "@web/core/helpers/form/validateSlackNotificationFields";
import SlackNotificationFieldsValues from "@web/core/models/form/SlackNotificationFieldsValues";
import getAPIEndpointWithSlackNotification from "@web/core/helpers/getAPIEndpointWithSlackNotification";

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
            </C.Text>
          </C.ModalHeader>

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
                <C.ModalBody>
                  <Field name="notifySlack">
                    {({ field }: FieldProps) => (
                      <C.Checkbox mb={2} defaultIsChecked={false} {...field}>
                        Also notify #bordeaux Slack channel:
                      </C.Checkbox>
                    )}
                  </Field>

                  <Field name="notificationMessage">
                    {({ field, meta }: FieldProps) => (
                      <C.FormControl>
                        <C.Textarea
                          {...field}
                          height="150px"
                          isRequired={values.notifySlack}
                          isDisabled={!values.notifySlack}
                          isInvalid={meta.touched && !!meta.error}
                          value={values.notificationMessage}
                        />
                      </C.FormControl>
                    )}
                  </Field>
                </C.ModalBody>

                <C.ModalFooter justifyContent="center">
                  <C.Button
                    isDisabled={!isValid}
                    type="submit"
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    loadingText="Saving..."
                    mx={2}
                  >
                    GO!
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
            )}
          </Formik>
        </C.ModalContent>
      </C.ModalOverlay>
    </C.Modal>
  );
};

export default MarkTOASTAsReady;
