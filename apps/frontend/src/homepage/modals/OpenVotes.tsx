import React, { FunctionComponent, useRef } from 'react';
import * as C from '@chakra-ui/core';
import { Field, FieldProps, Form, Formik } from 'formik';
import { mutate } from 'swr';

import { ToastStatus, Toast } from '@letsshareatoast/shared';

import http from 'frontend/core/httpClient';
import { APIPaths, pageColors, Pathnames } from 'frontend/core/constants';
import HighlightedText from 'frontend/core/components/HighlightedText';
import Image from 'frontend/core/components/Image';
import getAppURL from 'frontend/core/helpers/getAppURL';
import { getTOASTElapsedTimeSinceCreation } from 'frontend/core/helpers/timing';
import NotificationType from 'notifications/types/NotificationType';
import useStores from 'frontend/core/hooks/useStores';

interface FormErrors {
  notificationMessage?: boolean;
}

interface FormValues {
  notifySlack: boolean;
  notificationMessage: string;
}

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
  const { auth, notifications } = useStores();

  const cancelBtn = useRef();

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
                Open subjects voting toast !
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
              validateOnMount={true}
              validate={(values: FormValues) => {
                const errors: FormErrors = {};

                if (
                  values.notifySlack &&
                  values.notificationMessage.length === 0
                ) {
                  errors.notificationMessage = true;
                }

                return errors;
              }}
              onSubmit={async (values): Promise<void> => {
                const request = http();

                const updatedToast: Toast = await request(
                  `/toasts/${currentToast.id}/status`,
                  {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      status: ToastStatus.OPEN_FOR_VOTE,
                      notifySlack: values.notifySlack,
                      notificationMessage: values.notificationMessage,
                    }),
                  }
                );

                notifications.send(
                  auth.profile,
                  NotificationType.EDIT_TOAST_STATUS,
                  {
                    status: ToastStatus.OPEN_FOR_VOTE,
                  }
                );

                mutate(APIPaths.CURRENT_TOAST, updatedToast);

                closeModal();
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
