import firebase from "firebase/app";
import React, { FunctionComponent, Ref, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  ModalFooter,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Field, FieldProps, Formik, Form as FormikForm } from "formik";
import DayPickerInput from "react-day-picker/DayPickerInput";
import dayjs from "dayjs";

import { CurrentToast, User } from "@shared/models";
import { DatabaseRefPaths, CloudFunctionName } from "@shared/firebase";

import { firebaseData } from "@web/core/firebase/data";
import { Pathnames } from "@web/core/constants";
import getAppURL from "@web/core/helpers/getAppURL";
import isToast from "@web/core/helpers/isToast";
import { getFormattedTOASTDateWithRemainingDays } from "@web/core/helpers/timing";
import Image from "@web/core/components/Image";
import SelectUserInput from "@web/core/components/form/SelectUserInput";
import { SlackNotificationFieldsValues } from "@web/core/models/form/SlackNotificationFieldsValues";
import { validateSlackNotificationField } from "@web/core/helpers/form/validateSlackNotificationFields";
import DateInput from "./DateInput";
import DatePickerNavBar from "./DatePickerNavBar";
import DatePickerCaption from "./DatePickerCaption";
import datePickerCSS from "./DatePicker.module.css";

interface Props {
  currentToast: CurrentToast;
  cancelButtonRef: Ref<HTMLButtonElement>;
  closeModal(toastCreated: boolean): void;
}

interface FormErrors {
  dueDate?: boolean;
  notificationMessage?: boolean;
  organizer?: boolean;
  scribe?: boolean;
}

interface FormValues extends SlackNotificationFieldsValues {
  dueDate: Date;
  organizer?: User;
  scribe?: User;
}

const today = new Date();

const defaultSlackNotificationMessage = `@here {{PROFILE}} scheduled a new 🍞 TOAST 🍞 for {{DATE}} ! 🎉
✍️ It’s time to add / remove / update your subject(s) {{URL}}`;

const Form: FunctionComponent<Props> = ({
  currentToast,
  cancelButtonRef,
  closeModal,
}) => {
  const getFormattedSlackNotification = useCallback(
    (notificationText, toastDueDate) => {
      return notificationText
        .replace("{{PROFILE}}", firebaseData.connectedUser?.displayName)
        .replace(
          "{{DATE}}",
          getFormattedTOASTDateWithRemainingDays(toastDueDate)
        )
        .replace("{{URL}}", getAppURL() + Pathnames.SUBJECTS);
    },
    [firebaseData.connectedUser]
  );

  const dueDateValue = useMemo(() => {
    if (currentToast) {
      return dayjs(currentToast.date).hour(14).toDate();
    } else {
      const today = dayjs();

      /**
       * If we're already on friday.
       */
      if (today.day() === 5) {
        return today.add(1, "week").hour(14).toDate();
      } else {
        return today.day(5).hour(14).toDate();
      }
    }
  }, [currentToast]);

  return (
    <Formik
      validateOnMount={true}
      initialValues={{
        dueDate: dueDateValue,
        organizer: currentToast?.organizer,
        scribe: currentToast?.scribe,
        notifySlack: false,
        notificationMessage: defaultSlackNotificationMessage,
      }}
      validate={(values: FormValues) => {
        const errors: FormErrors = {};

        if (!values.dueDate) {
          errors.dueDate = true;
        }

        if (!values.organizer) {
          errors.organizer = true;
        }

        if (!values.scribe) {
          errors.scribe = true;
        }

        /**
         * In case we're editing a TOAST we don't need to
         * validate those fields because they're not displayed.
         * Only while creating a TOAST.
         */
        if (!currentToast && !validateSlackNotificationField(values)) {
          errors.notificationMessage = true;
        }

        return errors;
      }}
      onSubmit={async (values): Promise<void> => {
        if (!currentToast) {
          return firebase
            .functions()
            .httpsCallable(CloudFunctionName.CREATE_TOAST)({
              date: values.dueDate.getTime(),
              organizerId: values.organizer!.id,
              scribeId: values.scribe!.id,
              slackMessage: values.notifySlack
                ? values.notificationMessage
                : null,
            })
            .then(() => {
              closeModal(true);
            });

          // TODO: handle notification
        } else {
          return firebase
            .database()
            .ref(DatabaseRefPaths.CURRENT_TOAST)
            .update({
              date: values.dueDate.getTime(),
              organizerId: values.organizer!.id,
              scribeId: values.scribe!.id,
              modifiedDate: new Date().getTime(),
            })
            .then(() => {
              closeModal(true);
            });

          // TODO: handle notification
        }
      }}
    >
      {({ values, setFieldValue, isSubmitting, isValid }) => {
        return (
          <FormikForm>
            <Stack spacing={8}>
              <Box>
                <Field name="dueDate">
                  {({ field, meta }: FieldProps) => (
                    <FormControl
                      isRequired
                      isInvalid={meta.touched && !!meta.error}
                    >
                      <FormLabel htmlFor="dueDate">Due Date</FormLabel>
                      <Box position="relative">
                        {/* datePickerCSS : needs to be of type react-day-picker/ClassNames instead of CSSModuleClasses.
                        @ts-ignore */}
                        <DayPickerInput
                          {...field}
                          onDayChange={(date) => setFieldValue("dueDate", date)}
                          formatDate={getFormattedTOASTDateWithRemainingDays}
                          classNames={datePickerCSS}
                          component={DateInput}
                          keepFocus={false}
                          dayPickerProps={{
                            classNames: datePickerCSS,
                            firstDayOfWeek: 1,
                            disabledDays: (date) => dayjs(date).isBefore(today),
                            fromMonth: new Date(),
                            selectedDays: values.dueDate,
                            navbarElement: DatePickerNavBar,
                            captionElement: DatePickerCaption,
                          }}
                        />
                      </Box>
                    </FormControl>
                  )}
                </Field>
              </Box>

              <Stack spacing={5} direction="row">
                <Box flex={1}>
                  <Field name="organizer">
                    {({ field, meta }: FieldProps) => {
                      const isInvalid = meta.touched && !!meta.error;

                      return (
                        <FormControl isRequired isInvalid={isInvalid}>
                          <FormLabel htmlFor={field.name}>Organizer</FormLabel>
                          <SelectUserInput
                            {...field}
                            isDisabled={!firebaseData.users.length}
                            options={firebaseData.users}
                            isInvalid={isInvalid}
                            inputId={field.name}
                            value={field.value}
                            onChange={(user: User | null) => {
                              if (user) {
                                setFieldValue(field.name, user);
                              }
                            }}
                          />
                        </FormControl>
                      );
                    }}
                  </Field>
                </Box>

                <Box flex={1}>
                  <Field name="scribe">
                    {({ field, meta }: FieldProps) => {
                      const isInvalid = meta.touched && !!meta.error;

                      return (
                        <FormControl isRequired isInvalid={isInvalid}>
                          <FormLabel htmlFor={field.name}>Scribe</FormLabel>
                          <SelectUserInput
                            {...field}
                            isInvalid={isInvalid}
                            isDisabled={!firebaseData.users.length}
                            options={firebaseData.users}
                            name={field.name}
                            inputId={field.name}
                            value={field.value}
                            onChange={(user: User | null) => {
                              if (user) {
                                setFieldValue(field.name, user);
                              }
                            }}
                          />
                        </FormControl>
                      );
                    }}
                  </Field>
                </Box>
              </Stack>

              {!isToast(currentToast) && (
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
                          value={getFormattedSlackNotification(
                            values.notificationMessage,
                            values.dueDate
                          )}
                        />
                        <FormHelperText id="notificationMessage">
                          You can use Slack formatting message.
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Field>
                </Box>
              )}

              <ModalFooter justifyContent="center">
                <Button
                  type="submit"
                  isDisabled={!isValid}
                  overflow="hidden"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  loadingText={
                    !currentToast ? "Initializing TOAST..." : "Editing infos..."
                  }
                  mx={2}
                >
                  <Image
                    position="absolute"
                    left="5px"
                    bottom="-10px"
                    width={42}
                    height={50}
                    src="https://media.giphy.com/media/XgGwL8iUwHIOOMNwmH/giphy.webp"
                  />
                  <Text as="span" pl={35}>
                    {currentToast && "Edit"}
                    {!currentToast && "Let's go !"}
                  </Text>
                </Button>
                <Button
                  ref={cancelButtonRef}
                  isDisabled={isSubmitting}
                  onClick={() => closeModal(false)}
                  overflow="hidden"
                  type="button"
                  colorScheme="red"
                  variant="outline"
                  mx={2}
                >
                  <Image
                    position="absolute"
                    left="10px"
                    bottom="0"
                    width={35}
                    height={35}
                    src="https://media.giphy.com/media/4a6NdCWK5QQLWBJpsH/giphy.webp"
                  />
                  <Text as="span" pl={35}>
                    Cancel
                  </Text>
                </Button>
              </ModalFooter>
            </Stack>
          </FormikForm>
        );
      }}
    </Formik>
  );
};

export default Form;
