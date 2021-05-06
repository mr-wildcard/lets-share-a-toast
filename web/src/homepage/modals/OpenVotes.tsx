import React, { FunctionComponent, useRef } from "react";
import * as C from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik } from "formik";
import { mutate } from "swr";

import { Toast } from "@shared/models";
import { ToastStatus, URLQueryParams } from "@shared/enums";

import firebase from "@web/core/firebase";
import { APIPaths, pageColors, Pathnames } from "@web/core/constants";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import getAppURL from "@web/core/helpers/getAppURL";
import { getTOASTElapsedTimeSinceCreation } from "@web/core/helpers/timing";
import getAPIEndpointWithSlackNotification from "@web/core/helpers/getAPIEndpointWithSlackNotification";
import NotificationType from "@web/notifications/types/NotificationType";
import useStores from "@web/core/hooks/useStores";
import slackNotificationFieldsAreValid from "@web/core/helpers/form/validateSlackNotificationFields";
import SlackNotificationFieldsValues from "@web/core/models/form/SlackNotificationFieldsValues";
import { DatabaseRefPaths } from "@shared/firebase";

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
            </C.Text>
          </C.ModalHeader>
          <C.ModalBody>
            <Formik
              initialValues={{
                notifySlack: false,
                notificationMessage: `@here 🍞TOAST 🍞 Ladies and gentlemen, it's time to vote for your favorite subjects: ${votingToastURL}`,
              }}
              validate={(values: FormValues) => {
                const errors: FormErrors = {};

                if (!slackNotificationFieldsAreValid(values)) {
                  errors.notificationMessage = true;
                }

                return errors;
              }}
              onSubmit={async (values): Promise<void> => {
                /* TODO: handle slack
                const endpoint = values.notifySlack
                  ? getAPIEndpointWithSlackNotification(
                      APIPaths.TOAST_CURRENT_STATUS,
                      values.notificationMessage
                    )
                  : APIPaths.TOAST_CURRENT_STATUS;
                */

                return firebase.database
                  .ref(DatabaseRefPaths.CURRENT_TOAST)
                  .child("status")
                  .set(ToastStatus.OPEN_FOR_VOTE)
                  .then(() => {
                    closeModal();
                  });

                /*
                notifications.send(
                  // @ts-ignore
                  auth.profile,
                  NotificationType.EDIT_TOAST_STATUS,
                  {
                    status: ToastStatus.OPEN_FOR_VOTE,
                  }
                );
                 */
              }}
            >
              {({ values, isSubmitting, isValid }) => (
                <Form>
                  <C.Box>
                    <C.Box my={5}>
                      <C.Alert status="warning" variant="left-accent">
                        <C.Box flex={1}>
                          <C.AlertTitle textDecoration="underline">
                            TOAST has been created&nbsp;
                            {getTOASTElapsedTimeSinceCreation(
                              new Date(currentToast.createdDate)
                            )}
                            .
                          </C.AlertTitle>
                          <C.AlertDescription>
                            Be sure that people had enough time to manage their
                            subject(s) before opening votes!
                          </C.AlertDescription>
                        </C.Box>
                      </C.Alert>
                    </C.Box>

                    <C.Box>
                      <Field name="notifySlack">
                        {({ field }: FieldProps) => (
                          <C.Checkbox
                            mb={2}
                            defaultIsChecked={false}
                            {...field}
                          >
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
                    </C.Box>
                  </C.Box>

                  <C.ModalFooter justifyContent="center">
                    <C.Button
                      isDisabled={!isValid}
                      type="submit"
                      colorScheme="blue"
                      isLoading={isSubmitting}
                      loadingText="Opening votes..."
                      mx={2}
                    >
                      Open votes!
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
          </C.ModalBody>
        </C.ModalContent>
      </C.ModalOverlay>
    </C.Modal>
  );
};

export default OpenVotes;
