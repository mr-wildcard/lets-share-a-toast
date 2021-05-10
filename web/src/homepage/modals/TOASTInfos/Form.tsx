import React, {
  FunctionComponent,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as C from "@chakra-ui/react";
import { Field, FieldProps, Formik, Form as FormikForm } from "formik";
import DayPickerInput from "react-day-picker/DayPickerInput";
import useSWR, { mutate } from "swr";
import dayjs from "dayjs";

import { CurrentToast, User } from "@shared/models";
import { DatabaseRefPaths } from "@shared/firebase";

import firebase from "@web/core/firebase";
import { APIPaths, Pathnames } from "@web/core/constants";
import NotificationType from "@web/notifications/types/NotificationType";
import getUserFullname from "@web/core/helpers/getUserFullname";
import getAppURL from "@web/core/helpers/getAppURL";
import isToast from "@web/core/helpers/isToast";
import { getFormattedTOASTDateWithRemainingDays } from "@web/core/helpers/timing";
import useStores from "@web/core/hooks/useStores";
import Image from "@web/core/components/Image";
import SelectUserInput from "@web/core/components/form/SelectUserInput";
import getAPIEndpointWithSlackNotification from "@web/core/helpers/getAPIEndpointWithSlackNotification";
import SlackNotificationFieldsValues from "@web/core/models/form/SlackNotificationFieldsValues";
import slackNotificationFieldsAreValid from "@web/core/helpers/form/validateSlackNotificationFields";
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
  const { notifications } = useStores();

  const getFormattedSlackNotification = useCallback(
    (notificationText, toastDueDate) => {
      return notificationText
        .replace("{{PROFILE}}", firebase.connectedUser?.displayName)
        .replace(
          "{{DATE}}",
          getFormattedTOASTDateWithRemainingDays(toastDueDate)
        )
        .replace("{{URL}}", getAppURL() + Pathnames.SUBJECTS);
    },
    [firebase.connectedUser]
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
        if (!currentToast && !slackNotificationFieldsAreValid(values)) {
          errors.notificationMessage = true;
        }

        return errors;
      }}
      onSubmit={async (values): Promise<void> => {
        console.log({ values });
        if (!currentToast) {
          return firebase.functions
            .httpsCallable("createToast")({
              date: values.dueDate.getTime(),
              organizerId: values.organizer!.id,
              scribeId: values.scribe!.id,
            })
            .then(() => {
              closeModal(true);
            });

          /*
          notifications.send(auth.profile, NotificationType.CREATE_TOAST, {
            dueDate: values.dueDate.toString(),
          });
           */
        } else {
          return firebase.database
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

          /*
          notifications.send(auth.profile, NotificationType.EDIT_TOAST_INFOS);
          */
        }
      }}
    >
      {({ values, setFieldValue, isSubmitting, isValid }) => {
        return (
          <FormikForm>
            <C.Stack spacing={8}>
              <C.Box>
                <Field name="dueDate">
                  {({ field, meta }: FieldProps) => (
                    <C.FormControl
                      isRequired
                      isInvalid={meta.touched && !!meta.error}
                    >
                      <C.FormLabel htmlFor="dueDate">Due Date</C.FormLabel>
                      <C.Box position="relative">
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
                      </C.Box>
                    </C.FormControl>
                  )}
                </Field>
              </C.Box>

              <C.Stack spacing={5} direction="row">
                <C.Box flex={1}>
                  <Field name="organizer">
                    {({ field, meta }: FieldProps) => {
                      const isInvalid = meta.touched && !!meta.error;

                      return (
                        <C.FormControl isRequired isInvalid={isInvalid}>
                          <C.FormLabel htmlFor={field.name}>
                            Organizer
                          </C.FormLabel>
                          <SelectUserInput
                            {...field}
                            isDisabled={!firebase.users.length}
                            options={firebase.users}
                            isInvalid={isInvalid}
                            inputId={field.name}
                            value={field.value}
                            onChange={(user: User | null) => {
                              if (user) {
                                setFieldValue(field.name, user);
                              }
                            }}
                          />
                        </C.FormControl>
                      );
                    }}
                  </Field>
                </C.Box>

                <C.Box flex={1}>
                  <Field name="scribe">
                    {({ field, meta }: FieldProps) => {
                      const isInvalid = meta.touched && !!meta.error;

                      return (
                        <C.FormControl isRequired isInvalid={isInvalid}>
                          <C.FormLabel htmlFor={field.name}>Scribe</C.FormLabel>
                          <SelectUserInput
                            {...field}
                            isInvalid={isInvalid}
                            isDisabled={!firebase.users.length}
                            options={firebase.users}
                            name={field.name}
                            inputId={field.name}
                            value={field.value}
                            onChange={(user: User | null) => {
                              if (user) {
                                setFieldValue(field.name, user);
                              }
                            }}
                          />
                        </C.FormControl>
                      );
                    }}
                  </Field>
                </C.Box>
              </C.Stack>

              {!isToast(currentToast) && (
                <C.Box>
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
                          value={getFormattedSlackNotification(
                            values.notificationMessage,
                            values.dueDate
                          )}
                        />
                        <C.FormHelperText id="notificationMessage">
                          You can use Slack formatting message.
                        </C.FormHelperText>
                      </C.FormControl>
                    )}
                  </Field>
                </C.Box>
              )}

              <C.ModalFooter justifyContent="center">
                <C.Button
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
                  <C.Text as="span" pl={35}>
                    {currentToast && "Edit"}
                    {!currentToast && "Let's go !"}
                  </C.Text>
                </C.Button>
                <C.Button
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
                  <C.Text as="span" pl={35}>
                    Cancel
                  </C.Text>
                </C.Button>
              </C.ModalFooter>
            </C.Stack>
          </FormikForm>
        );
      }}
    </Formik>
  );
};

export default Form;
