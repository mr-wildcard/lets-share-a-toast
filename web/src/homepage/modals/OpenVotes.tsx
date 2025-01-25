import React, { FC, useRef } from "react";
import {
  Alert,
  Alert.Description,
  Alert.Title,
  Box,
  Button,
  Checkbox,
  Field as ChakraField,
  Dialog.Root,
  Dialog.Body,
  Dialog.Content,
  Dialog.Footer,
  Dialog.Header,
  ModalOverlay,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";

import { Toast } from "@shared/models";

import { firebaseData } from "@web/core/firebase/data";
import { pageColors, Pathnames } from "@web/core/constants";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import getAppURL from "@web/core/helpers/getAppURL";
import { getTOASTElapsedTimeSinceCreation } from "@web/core/helpers/timing";
import { SlackNotificationFieldsValues } from "@web/core/models/form/SlackNotificationFieldsValues";
import { validateSlackNotificationField } from "@web/core/helpers/form/validateSlackNotificationFields";
import { getCloudFunctionOpenVotes } from "@web/core/firebase/helpers";

interface FormErrors {
  slackMessage?: boolean;
}

type FormValues = SlackNotificationFieldsValues;

interface Props {
  currentToast: Toast;
  closeModal(): void;
}

const OpenVotes: FC<Props> = ({ currentToast, closeModal }) => {
  const cancelBtn = useRef<HTMLButtonElement>(null);

  const votingToastURL = getAppURL() + Pathnames.VOTING_SESSION;

  const totalAvailableSubjects = firebaseData.availableSubjects.length;

  return (
    <Dialog.Root
      placement="center"
      onOpenChange={closeModal}
      open={true}
      initialFocusEl={() => cancelBtn.current}
      closeOnEscape={true}
      size="lg"
    >

        <Dialog.Content borderRadius="3px">
          <Dialog.Header textAlign="center">
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
          </Dialog.Header>
          <Dialog.Body>
            <Formik
              initialValues={{
                notifySlack: false,
                slackMessage: `@here 🍞TOAST 🍞 Ladies and gentlemen, it's time to vote for your favorite subject(s): ${votingToastURL}`,
              }}
              validate={(values: FormValues) => {
                const errors: FormErrors = {};

                if (!validateSlackNotificationField(values)) {
                  errors.slackMessage = true;
                }

                return errors;
              }}
              onSubmit={async (values): Promise<void> => {
                const openVotes = getCloudFunctionOpenVotes();

                await openVotes({
                  slackMessage: values.notifySlack ? values.slackMessage : null,
                }).then(closeModal);
              }}
            >
              {({ isSubmitting, isValid }) => (
                <Form>
                  <Box>
                    <Box my={5}>
                      <Alert.Root status="warning" >
                        <Box flex={1}>
                          <Alert.Title textDecoration="underline">
                            TOAST has been created&nbsp;
                            {getTOASTElapsedTimeSinceCreation(
                              new Date(currentToast.createdDate)
                            )}
                            .
                          </Alert.Title>
                          <Alert.Description>
                            Be sure that people had enough time to manage their
                            subject(s) before opening votes!
                            <br />
                            <Text as="span" fontWeight="bold">
                              {totalAvailableSubjects}
                            </Text>
                            &nbsp;available subjects will be added to the voting
                            session.
                          </Alert.Description>
                        </Box>
                      </Alert.Root>
                    </Box>

                    <Box>
                      <Field name="notifySlack">
                        {({ field }: FieldProps) => (
                          <Checkbox mb={2} defaultChecked={false} {...field}>
                            Also notify #bordeaux Slack channel:
                          </Checkbox>
                        )}
                      </Field>

                      <Field name="slackMessage">
                        {({ field, meta, form }: FieldProps) => (
                          <ChakraField.Root>
                            <Textarea
                              {...field}
                              height="150px"
                              required={form.values.notifySlack}
                              disabled={!form.values.notifySlack}
                              invalid={meta.touched && !!meta.error}
                              value={field.value}
                            />
                          </ChakraField.Root>
                        )}
                      </Field>
                    </Box>
                  </Box>

                  <Dialog.Footer justifyContent="center">
                    <Button
                      disabled={!isValid}
                      type="submit"
                      colorScheme="blue"
                      loading={isSubmitting}
                      loadingText="Opening votes..."
                      mx={2}
                    >
                      Open votes!
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
                      Cancel
                    </Button>
                  </Dialog.Footer>
                </Form>
              )}
            </Formik>
          </Dialog.Body>
        </Dialog.Content>

    </Dialog.Root>
  );
};

export default observer(OpenVotes);
