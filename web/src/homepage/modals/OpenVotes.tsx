import React, { FC, useRef } from "react";
import { Alert, Box, Button, HStack, Text, Textarea } from "@chakra-ui/react";
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
import { Checkbox } from "@web/components/ui/checkbox";
import { Field as ChakraField } from "@web/components/ui/field";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@web/components/ui/dialog";

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
    <DialogRoot
      placement="center"
      onOpenChange={closeModal}
      open={true}
      initialFocusEl={() => cancelBtn.current}
      closeOnEscape={true}
      size="md"
    >
      <DialogContent borderRadius="3px">
        <DialogHeader textAlign="center">
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
        </DialogHeader>
        <DialogBody>
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
                    <Alert.Root status="warning">
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
                        <ChakraField
                          required={form.values.notifySlack}
                          disabled={!form.values.notifySlack}
                          invalid={meta.touched && !!meta.error}
                        >
                          <Textarea
                            {...field}
                            height="150px"
                            value={field.value}
                          />
                        </ChakraField>
                      )}
                    </Field>
                  </Box>
                </Box>

                <DialogFooter justifyContent="center">
                  <HStack gap={4}>
                    <Button
                      disabled={!isValid}
                      type="submit"
                      colorPalette="blue"
                      loading={isSubmitting}
                      loadingText="Opening votes..."
                    >
                      Open votes!
                    </Button>
                    <Button
                      ref={cancelBtn}
                      disabled={isSubmitting}
                      onClick={closeModal}
                      type="button"
                      colorPalette="red"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </HStack>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default observer(OpenVotes);
