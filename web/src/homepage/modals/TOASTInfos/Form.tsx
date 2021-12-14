import { update, serverTimestamp } from "firebase/database";
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
  HStack,
  Text,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
  Tooltip,
} from "@chakra-ui/react";
import { Field, FieldProps, Formik, Form } from "formik";
import DayPicker from "react-day-picker/DayPickerInput";
import dayjs from "dayjs";

import { CurrentToast, User } from "@shared/models";

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
import { InfoIcon } from "@chakra-ui/icons";

/**
 * Related issue : https://github.com/gpbl/react-day-picker/issues/1194
 * DayPickerInput is working fine in dev mode, but was broken after production build.
 */
// @ts-ignore
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

interface FormValues extends SlackNotificationFieldsValues {
  dueDate: Date;
  maxSelectableSubjects: number;
  maxVotesPerUser: number;
  organizer?: User;
  scribe?: User;
}

const today = new Date();

const defaultSlackNotificationMessage = `@here {{PROFILE}} scheduled a new 🍞 TOAST 🍞 for {{DATE}} ! 🎉
✍️ It’s time to add / remove / update your subject(s) {{URL}}`;

const TOASTForm: FunctionComponent<Props> = ({
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
      onSubmit={async (values): Promise<void> => {
        if (!currentToast) {
          const createToastCloudFunction = getCloudFunctionCreateTOAST();

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
            <Stack spacing={6}>
              <Field name="dueDate">
                {({ field, meta }: FieldProps) => (
                  <FormControl
                    isRequired
                    isInvalid={meta.touched && !!meta.error}
                  >
                    <FormLabel htmlFor="dueDate">Day</FormLabel>
                    <Box position="relative">
                      {/* datePickerCSS : needs to be of type react-day-picker/ClassNames instead of CSSModuleClasses.
                        @ts-ignore */}
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
                  </FormControl>
                )}
              </Field>

              <HStack spacing={5}>
                <FormControl w="auto">
                  <FormLabel htmlFor="selectedHour">Hour</FormLabel>
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
                </FormControl>
                <Field name="maxSelectableSubjects">
                  {({ field, meta }: FieldProps) => (
                    <FormControl
                      isRequired
                      isInvalid={meta.touched && !!meta.error}
                    >
                      <FormLabel
                        htmlFor={field.name}
                        d="flex"
                        alignItems="center"
                      >
                        Max subjects&nbsp;
                        <Tooltip
                          label="Maximum number of subjects which can be presented during this TOAST"
                          aria-label="Form field info"
                        >
                          <InfoIcon />
                        </Tooltip>
                      </FormLabel>
                      <NumberInput
                        {...field}
                        onChange={(value) => {
                          setFieldValue(field.name, value);
                        }}
                        id={field.name}
                        min={1}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  )}
                </Field>

                <Field name="maxVotesPerUser">
                  {({ field, meta }: FieldProps) => (
                    <FormControl
                      isRequired
                      isInvalid={meta.touched && !!meta.error}
                    >
                      <FormLabel htmlFor={field.name}>
                        Total votes per user
                      </FormLabel>
                      <NumberInput
                        {...field}
                        onChange={(value) => {
                          setFieldValue(field.name, value);
                        }}
                        id={field.name}
                        min={1}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  )}
                </Field>
              </HStack>

              <HStack spacing={5}>
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
                            onChange={(user) => {
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
                            onChange={(user) => {
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
              </HStack>

              {!currentToast && (
                <Box>
                  <Field name="notifySlack">
                    {({ field }: FieldProps) => (
                      <Checkbox mb={2} defaultIsChecked={false} {...field}>
                        Also notify #bordeaux Slack channel:
                      </Checkbox>
                    )}
                  </Field>

                  <Field name="slackMessage">
                    {({ field, meta }: FieldProps) => (
                      <FormControl>
                        <Textarea
                          {...field}
                          height="150px"
                          isRequired={values.notifySlack}
                          isDisabled={!values.notifySlack}
                          isInvalid={meta.touched && !!meta.error}
                          value={getFormattedSlackNotification(
                            values.slackMessage,
                            values.dueDate
                          )}
                        />
                        <FormHelperText id="slackMessage">
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
          </Form>
        );
      }}
    </Formik>
  );
};

export default TOASTForm;
