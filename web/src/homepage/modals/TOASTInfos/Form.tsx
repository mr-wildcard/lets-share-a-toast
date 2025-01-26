import { update, serverTimestamp } from "firebase/database";
import React, { FC, Ref, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Stack,
  HStack,
  Text,
  Textarea,
  Input,
  FieldLabel,
  NumberInput,
  Dialog,
} from "@chakra-ui/react";
import { Field, FieldProps, Formik, Form } from "formik";
import DayPicker from "react-day-picker/DayPickerInput";
import dayjs from "dayjs";

import { CurrentToast, User } from "@shared/models";

import { Field as ChakraField } from "@web/components/ui/field";
import { firebaseData } from "@web/core/firebase/data";
import { Pathnames } from "@web/core/constants";
import getAppURL from "@web/core/helpers/getAppURL";
import { getFormattedTOASTDateWithRemainingDays } from "@web/core/helpers/timing";
import Image from "@web/core/components/Image";
import SelectUserInput from "@web/core/components/form/SelectUserInput";
import { SlackNotificationFieldsValues } from "@web/core/models/form/SlackNotificationFieldsValues";
import { validateSlackNotificationField } from "@web/core/helpers/form/validateSlackNotificationFields";
import DateInput from "./DateInput";
import DatePickerNavBar from "./DatePickerNavBar";
import DatePickerCaption from "./DatePickerCaption";
import datePickerCSS from "./DatePicker.module.css";
import {
  getCloudFunctionCreateTOAST,
  getFirebaseCurrentToastRef,
} from "@web/core/firebase/helpers";
import { LuInfo } from "react-icons/lu";
import { Tooltip } from "@web/components/ui/tooltip";
import { Checkbox } from "@web/components/ui/checkbox";

const createToastCloudFunction = getCloudFunctionCreateTOAST();

/**
 * Related issue : https://github.com/gpbl/react-day-picker/issues/1194
 * DayPickerInput is working fine in dev mode, but was broken after production build.
 */
// @ts-expect-error Ok alright
const DayPickerInput = DayPicker.__esModule ? DayPicker.default : DayPicker;

interface Props {
  currentToast: CurrentToast;
  cancelButtonRef: Ref<HTMLButtonElement>;
  closeModal(toastCreated?: boolean): void;
}

interface FormErrors {
  dueDate?: boolean;
  slackMessage?: boolean;
  organizer?: boolean;
  scribe?: boolean;
}

type FormValues = SlackNotificationFieldsValues & {
  dueDate: Date;
  maxSelectableSubjects: number;
  maxVotesPerUser: number;
  organizer?: User;
  scribe?: User;
};

const today = new Date();

const defaultSlackNotificationMessage = `@here {{PROFILE}} scheduled a new 🍞 TOAST 🍞 for {{DATE}} ! 🎉
✍️ It’s time to add / remove / update your subject(s) {{URL}}`;

const TOASTForm: FC<Props> = ({
  currentToast,
  cancelButtonRef,
  closeModal,
}) => {
  const getFormattedSlackNotification = useCallback(
    (notificationText: string, toastDueDate: Date) => {
      return notificationText
        .replace(
          "{{PROFILE}}",
          firebaseData.connectedUser?.displayName || "N/A"
        )
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
      return currentToast.date;
    } else {
      const today = dayjs();

      /**
       * If we're already on friday.
       */
      if (today.day() >= 5) {
        /**
         * Set date to next week's friday.
         */
        return today.add(1, "week").hour(14).minute(0).second(0).toDate();
      } else {
        return today.day(5).hour(14).minute(0).second(0).toDate();
      }
    }
  }, [currentToast]);

  return (
    <Formik
      validateOnMount={true}
      initialValues={{
        dueDate: dueDateValue,
        maxSelectableSubjects: currentToast
          ? currentToast.maxSelectableSubjects
          : 2,
        maxVotesPerUser: currentToast ? currentToast.maxVotesPerUser : 3,
        organizer: currentToast?.organizer,
        scribe: currentToast?.scribe,
        notifySlack: false,
        slackMessage: defaultSlackNotificationMessage,
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
          errors.slackMessage = true;
        }

        return errors;
      }}
      onSubmit={async (values: FormValues): Promise<void> => {
        if (!currentToast) {
          return createToastCloudFunction({
            date: values.dueDate.getTime(),
            maxSelectableSubjects: values.maxSelectableSubjects,
            maxVotesPerUser: values.maxVotesPerUser,
            organizerId: values.organizer!.id,
            scribeId: values.scribe!.id,
            slackMessage: values.notifySlack
              ? getFormattedSlackNotification(
                  values.slackMessage,
                  values.dueDate
                )
              : null,
          }).then(() => {
            closeModal(true);
          });
        } else {
          const currentToastRef = getFirebaseCurrentToastRef();

          return update(currentToastRef, {
            date: values.dueDate.getTime(),
            maxSelectableSubjects: values.maxSelectableSubjects,
            maxVotesPerUser: values.maxVotesPerUser,
            organizerId: values.organizer!.id,
            scribeId: values.scribe!.id,
            modifiedDate: serverTimestamp(),
          }).then(() => closeModal());
        }
      }}
    >
      {({ values, setFieldValue, isSubmitting, isValid }) => {
        return (
          <Form>
            <Stack gap={6}>
              <Field name="dueDate">
                {({ field, meta }: FieldProps) => (
                  <ChakraField
                    required
                    label="Day"
                    invalid={meta.touched && !!meta.error}
                  >
                    <Box position="relative">
                      <DayPickerInput
                        {...field}
                        onDayChange={(date: Date) =>
                          setFieldValue(field.name, date)
                        }
                        formatDate={getFormattedTOASTDateWithRemainingDays}
                        classNames={datePickerCSS}
                        component={DateInput}
                        keepFocus={false}
                        dayPickerProps={{
                          classNames: datePickerCSS,
                          firstDayOfWeek: 1,
                          disabledDays: (date: Date) =>
                            dayjs(date).isBefore(today),
                          fromMonth: currentToast
                            ? currentToast?.date
                            : new Date(),
                          selectedDays: values.dueDate,
                          navbarElement: DatePickerNavBar,
                          captionElement: DatePickerCaption,
                        }}
                      />
                    </Box>
                  </ChakraField>
                )}
              </Field>

              <HStack gap={5}>
                <ChakraField label="Hour" w="auto">
                  <Input
                    id="selectedHour"
                    type="time"
                    min="08:00"
                    max="20:00"
                    value={dayjs(values.dueDate).format("HH:mm")}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(":");

                      const dueDate = dayjs(values.dueDate)
                        .hour(Number(hours))
                        .minute(Number(minutes));

                      setFieldValue("dueDate", dueDate.toDate());
                    }}
                  />
                </ChakraField>
                <Field name="maxSelectableSubjects">
                  {({ field, meta }: FieldProps) => (
                    <ChakraField
                      required
                      invalid={meta.touched && !!meta.error}
                    >
                      <FieldLabel
                        htmlFor={field.name}
                        display="flex"
                        alignItems="center"
                      >
                        Max subjects&nbsp;
                        <Tooltip
                          content="Maximum number of subjects which can be presented during this TOAST"
                          aria-label="Form field info"
                        >
                          <LuInfo />
                        </Tooltip>
                      </FieldLabel>
                      <NumberInput.Root
                        {...field}
                        onValueChange={(event) => {
                          setFieldValue(field.name, event.value);
                        }}
                        id={field.name}
                        min={1}
                      >
                        <NumberInput.Input />
                        <NumberInput.Control>
                          <NumberInput.IncrementTrigger />
                          <NumberInput.DecrementTrigger />
                        </NumberInput.Control>
                      </NumberInput.Root>
                    </ChakraField>
                  )}
                </Field>

                <Field name="maxVotesPerUser">
                  {({ field, meta }: FieldProps) => (
                    <ChakraField
                      label="Total votes per user"
                      required
                      invalid={meta.touched && !!meta.error}
                    >
                      <NumberInput.Root
                        {...field}
                        onValueChange={(event) => {
                          setFieldValue(field.name, event.value);
                        }}
                        id={field.name}
                        min={1}
                      >
                        <NumberInput.Input />
                        <NumberInput.Control>
                          <NumberInput.IncrementTrigger />
                          <NumberInput.DecrementTrigger />
                        </NumberInput.Control>
                      </NumberInput.Root>
                    </ChakraField>
                  )}
                </Field>
              </HStack>

              <HStack gap={5}>
                <Box flex={1}>
                  <Field name="organizer">
                    {({ field, meta }: FieldProps) => {
                      const invalid = meta.touched && !!meta.error;

                      return (
                        <ChakraField
                          label="Organizer"
                          required
                          invalid={invalid}
                          disabled={!firebaseData.users.length}
                        >
                          <SelectUserInput
                            {...field}
                            options={firebaseData.users}
                            invalid={invalid}
                            inputId={field.name}
                            value={field.value}
                            onChange={(user) => {
                              if (user) {
                                setFieldValue(field.name, user);
                              }
                            }}
                          />
                        </ChakraField>
                      );
                    }}
                  </Field>
                </Box>

                <Box flex={1}>
                  <Field name="scribe">
                    {({ field, meta }: FieldProps) => {
                      const invalid = meta.touched && !!meta.error;

                      return (
                        <ChakraField
                          label="Scribe"
                          required
                          invalid={invalid}
                          disabled={!firebaseData.users.length}
                        >
                          <SelectUserInput
                            {...field}
                            invalid={invalid}
                            options={firebaseData.users}
                            name={field.name}
                            inputId={field.name}
                            value={field.value}
                            onChange={(user) => {
                              if (user) {
                                setFieldValue(field.name, user);
                              }
                            }}
                          />
                        </ChakraField>
                      );
                    }}
                  </Field>
                </Box>
              </HStack>

              {!currentToast && (
                <Box>
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
                        helperText="You can use Slack formatting message."
                        disabled={!values.notifySlack}
                        invalid={meta.touched && !!meta.error}
                        required={values.notifySlack}
                      >
                        <Textarea
                          {...field}
                          height="150px"
                          value={getFormattedSlackNotification(
                            values.slackMessage,
                            values.dueDate
                          )}
                        />
                      </ChakraField>
                    )}
                  </Field>
                </Box>
              )}

              <Dialog.Footer justifyContent="center">
                <Button
                  type="submit"
                  disabled={!isValid}
                  overflow="hidden"
                  colorScheme="blue"
                  loading={isSubmitting}
                  loadingText={
                    !currentToast ? "Creating TOAST..." : "Saving..."
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
                    {currentToast && "Save modifications"}
                    {!currentToast && "Let's go !"}
                  </Text>
                </Button>
                <Button
                  ref={cancelButtonRef}
                  disabled={isSubmitting}
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
              </Dialog.Footer>
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
};

export default TOASTForm;
