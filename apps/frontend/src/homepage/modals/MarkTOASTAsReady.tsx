import React, { FunctionComponent, useRef } from 'react';
import * as C from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { mutate } from 'swr';

import { Toast } from '@letsshareatoast/shared';

import { ToastStatus } from '@letsshareatoast/shared';

import { APIPaths, pageColors } from 'frontend/core/constants';
import HighlightedText from 'frontend/core/components/HighlightedText';
import Image from 'frontend/core/components/Image';
import { getTOASTIsReadySlackMessage } from 'frontend/homepage/helpers';
import http from 'frontend/core/httpClient';
import NotificationType from 'frontend/notifications/types/NotificationType';
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

const MarkTOASTAsReady: FunctionComponent<Props> = ({
  currentToast,
  isOpen,
  closeModal,
}) => {
  const cancelBtn = useRef();

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

              if (
                values.notifySlack &&
                values.notificationMessage.length === 0
              ) {
                errors.notificationMessage = true;
              }

              return errors;
            }}
            onSubmit={async (values) => {
              console.log('Mark TOAST as ready', { values });

              const request = http();

              const updatedToast: Toast = await request(
                APIPaths.CURRENT_TOAST,
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    status: ToastStatus.WAITING_FOR_TOAST,
                    // TODO: add slack messages
                  }),
                }
              );

              notifications.send(
                auth.profile,
                NotificationType.EDIT_TOAST_STATUS,
                {
                  status: ToastStatus.WAITING_FOR_TOAST,
                }
              );

              mutate(APIPaths.CURRENT_TOAST, updatedToast);

              closeModal();
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
