import React, { FC, useRef } from "react";
import {
  Text,
  DialogRoot,
  Textarea,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik } from "formik";

import { Toast } from "@shared/models";
import { Field as ChakraField } from "@web/components/ui/field";
import { validateSlackNotificationField } from "@web/core/helpers/form/validateSlackNotificationFields";
import { SlackNotificationFieldsValues } from "@web/core/models/form/SlackNotificationFieldsValues";
import { getCloudFunctionSetTOASTReady } from "@web/core/firebase/helpers";
import { pageColors } from "@web/core/constants";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import { getTOASTIsReadySlackMessage } from "@web/homepage/helpers";
import { Checkbox } from "@web/components/ui/checkbox";

interface FormErrors {
  slackMessage?: boolean;
}

type FormValues = SlackNotificationFieldsValues;

interface Props {
  currentToast: Toast;
  closeModal(): void;
}

const MarkTOASTAsReady: FC<Props> = ({ currentToast, closeModal }) => {
  const cancelBtn = useRef<HTMLButtonElement>(null);

  return (
    <DialogRoot
      placement="center"
      onOpenChange={closeModal}
      open={true}
      initialFocusEl={() => cancelBtn.current}
      closeOnEscape={true}
      size="lg"
    >
      <DialogContent borderRadius="3px">
        <DialogHeader textAlign="center">
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
        </DialogHeader>

        <Formik
          initialValues={{
            notifySlack: false,
            slackMessage: getTOASTIsReadySlackMessage(currentToast),
          }}
          validate={(values: FormValues) => {
            const errors: FormErrors = {};

            if (!validateSlackNotificationField(values)) {
              errors.slackMessage = true;
            }

            return errors;
          }}
          onSubmit={(values: FormValues) => {
            const setTOASTReady = getCloudFunctionSetTOASTReady();

            return setTOASTReady({
              slackMessage: values.notifySlack ? values.slackMessage : null,
            }).then(closeModal);
          }}
        >
          {({ values, isSubmitting, isValid }) => (
            <Form>
              <DialogBody>
                <Field name="notifySlack">
                  {({ field }: FieldProps) => (
                    <Checkbox mb={2} defaultChecked={false} {...field}>
                      Also notify #bordeaux Slack channel:
                    </Checkbox>
                  )}
                </Field>

                <Field name="slackMessage">
                  {({ field, meta }: FieldProps) => (
                    <ChakraField
                      required={values.notifySlack}
                      disabled={!values.notifySlack}
                      invalid={meta.touched && !!meta.error}
                    >
                      <Textarea
                        {...field}
                        height="150px"
                        value={values.slackMessage}
                      />
                    </ChakraField>
                  )}
                </Field>
              </DialogBody>

              <DialogFooter justifyContent="center">
                <Button
                  disabled={!isValid}
                  type="submit"
                  colorScheme="blue"
                  loading={isSubmitting}
                  loadingText="Saving..."
                  mx={2}
                >
                  GO!
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
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </DialogRoot>
  );
};

export default MarkTOASTAsReady;
