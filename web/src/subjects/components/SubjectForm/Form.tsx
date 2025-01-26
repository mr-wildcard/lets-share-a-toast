import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { FC, useMemo } from "react";
import {
  Alert,
  Box,
  Slider,
  Button,
  Drawer,
  Flex,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  Group,
  InputAddon,
} from "@chakra-ui/react";
import { Field as ChakraField } from "@web/components/ui/field";
import { AddIcon, CheckIcon, TimeIcon, WarningIcon } from "@chakra-ui/icons";
import { observer } from "mobx-react-lite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import {
  Field,
  FieldArray,
  FieldProps,
  Form as FormikForm,
  Formik,
  FormikProps,
} from "formik";
import Select from "react-select";

import { Subject, User } from "@shared/models";
import { SubjectLanguage, SubjectStatus, ToastStatus } from "@shared/enums";
import { FirestoreCollection } from "@shared/firebase";

// import { Slider } from '@web/components/ui/slider';
import { firebaseData } from "@web/core/firebase/data";
import { pageColors } from "@web/core/constants";
import { getTOASTRemainingDays } from "@web/core/helpers/timing";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import SelectUserInput from "@web/core/components/form/SelectUserInput";
import subjectIsInVotingSession from "@web/core/helpers/subjectIsInVotingSession";
import SubjectStatusBadge from "@web/subjects/components/item/SubjectStatusBadge";
import { getFirestoreSubjectDoc } from "@web/core/firebase/helpers";
import { subjectIsSelectedForNextTOAST } from "@web/core/helpers/subjectIsSelectedForNextTOAST";
import StatusField from "./StatusField";

interface LanguageValue {
  label: string;
  value: SubjectLanguage;
}

interface FormErrors {
  title?: boolean;
  speakers?: boolean;
  description?: boolean;
  duration?: boolean;
  cover?: boolean;
}

interface FormValues {
  title: string;
  speakers: User[];
  description: string;
  duration: number;
  language: LanguageValue;
  cover: string;
  comment: string;
  status: SubjectStatus;
}

interface Props {
  subject?: Subject;
  closeForm(): void;
}

const coverPlaceholder =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8XQ8AAhsBTLgo62UAAAAASUVORK5CYII=";

const languageOptions: LanguageValue[] = [
  {
    label: "Français",
    value: SubjectLanguage.FR,
  },
  {
    label: "English",
    value: SubjectLanguage.EN,
  },
];

const Form: FC<Props> = ({ subject, closeForm }) => {
  const { currentToast, users, connectedUser } = firebaseData;

  const isCreatingSubject = !subject;

  const warnAboutNewSubjectDuringVotingSession = useMemo(() => {
    return (
      isCreatingSubject && currentToast?.status === ToastStatus.OPEN_FOR_VOTE
    );
  }, [isCreatingSubject, currentToast]);

  const alertAboutStatusChangeDuringVotingSession = useMemo(() => {
    return (
      !isCreatingSubject &&
      !!currentToast &&
      subjectIsInVotingSession(currentToast.status, subject!.status)
    );
  }, [isCreatingSubject, currentToast, subject]);

  const subjectHasBeenSelectedForNextTOAST =
    !isCreatingSubject && subjectIsSelectedForNextTOAST(subject!.status);

  return (
    <Formik
      validateOnMount={true}
      initialValues={{
        title: isCreatingSubject ? "" : subject!.title,
        description: isCreatingSubject ? "" : subject!.description,
        language: isCreatingSubject
          ? languageOptions[0]
          : languageOptions.find(
              (option) => option.value === subject!.language
            )!,
        duration: isCreatingSubject ? 30 : subject!.duration,
        speakers: isCreatingSubject
          ? [users.find((user) => user.id === connectedUser?.uid)!]
          : subject!.speakers,
        cover: isCreatingSubject ? "" : subject!.cover || "",
        comment: isCreatingSubject ? "" : subject!.comment || "",
        status: warnAboutNewSubjectDuringVotingSession
          ? SubjectStatus.UNAVAILABLE
          : isCreatingSubject
          ? SubjectStatus.AVAILABLE
          : subject!.status,
      }}
      validate={(values: FormValues) => {
        const errors: FormErrors = {};

        if (!values.title) {
          errors.title = true;
        }

        if (values.speakers.length === 0) {
          errors.speakers = true;
        }

        if (!values.description) {
          errors.description = true;
        }

        if (values.cover) {
          try {
            new URL(values.cover);
          } catch (error) {
            if (error instanceof TypeError) {
              errors.cover = true;
            }
          }
        }

        return errors;
      }}
      onSubmit={(values: FormValues) => {
        /**
         * When adding a Field for a new speaker, its default value is `null`.
         * If the form is submitted without selecting a user in the select input,
         * `null` value arrives here in the submit callback
         * and we need to get rid of it.
         */
        const speakers = values.speakers.filter(Boolean);

        const input = {
          title: values.title,
          speakersIds: speakers.map((speaker) => speaker.id),
          description: values.description,
          duration: values.duration,
          language: values.language.value,
          comment: values.comment,
          cover: values.cover,
          status: values.status,
          createdDate: isCreatingSubject
            ? serverTimestamp()
            : subject?.createdDate,
          createdByUserId: isCreatingSubject
            ? firebaseData.connectedUser?.uid
            : subject?.createdByUser.id,
          lastModifiedDate: serverTimestamp(),
          lastModifiedByUserId: firebaseData.connectedUser?.uid,
        };

        if (isCreatingSubject) {
          const firestore = getFirestore();
          const subjectsCollection = collection(
            firestore,
            FirestoreCollection.SUBJECTS
          );

          return addDoc(subjectsCollection, input)
            .then(() => closeForm())
            .catch((error) => {
              console.error(
                "Couldn't create subject because of Firebase error :",
                error
              );
            });
        } else {
          const subjectDoc = getFirestoreSubjectDoc(subject!.id);

          return setDoc(subjectDoc, input)
            .then(() => closeForm())
            .catch((error) => {
              console.error(
                "Couldn't update subject because of Firebase error :",
                error
              );
            });
        }
      }}
    >
      {({
        values,
        setFieldValue,
        isSubmitting,
        isValid,
      }: FormikProps<FormValues>) => {
        return (
          <FormikForm>
            <Drawer.Root>
              <Drawer.Backdrop />
              <Drawer.Content>
                <Drawer.Header>
                  <Flex wrap="nowrap" align="start">
                    <Flex align="center" justify="center" mx="auto">
                      <Text textAlign="center" wordBreak="break-word">
                        <HighlightedText
                          display="inline-block"
                          bgColor={pageColors.subjects}
                          animDelay={500}
                        >
                          {isCreatingSubject
                            ? values.title.length
                              ? `Creating new subject: "${values.title}"`
                              : "Creating a new subject"
                            : `Editing subject: "${subject!.title}"`}
                        </HighlightedText>
                      </Text>
                      <Image
                        transform="translateY(-3px)"
                        width={141}
                        height={65}
                        src="https://media.giphy.com/media/3og0IARm07OVhdM8a4/giphy.webp"
                      />
                    </Flex>
                    <Drawer.CloseTrigger padding={2} />
                  </Flex>
                </Drawer.Header>
                <Drawer.Body>
                  <Box mb={5}>
                    {warnAboutNewSubjectDuringVotingSession && (
                      <Alert.Root status="warning">
                        <Alert.Indicator />
                        <Box flex="1">
                          <Alert.Title fontSize="lg">
                            You're about to create a new subject: that's great!
                            But be advised...
                          </Alert.Title>
                          <Alert.Description>
                            A voting session for the next TOAST coming&nbsp;
                            {getTOASTRemainingDays(
                              new Date(currentToast!.date)
                            )}
                            &nbsp;is currently opened. If you submit this
                            subject with the&nbsp;
                            <SubjectStatusBadge
                              status={SubjectStatus.AVAILABLE}
                            />
                            &nbsp;status, it will be automatically added to it.
                          </Alert.Description>
                        </Box>
                      </Alert.Root>
                    )}
                    {alertAboutStatusChangeDuringVotingSession && (
                      <Alert.Root status="error">
                        <Alert.Indicator />
                        <Box flex="1">
                          <Alert.Title fontSize="lg">Watch out!</Alert.Title>
                          <Alert.Description>
                            <Text>
                              This subject is currently in the voting session
                              for the next TOAST!
                            </Text>
                            <Text>
                              Changing its status to something else than&nbsp;
                              <SubjectStatusBadge status={subject!.status} />
                              &nbsp;will make it lose all its votes!
                            </Text>
                          </Alert.Description>
                        </Box>
                      </Alert.Root>
                    )}
                  </Box>

                  <Stack gap={8}>
                    <Box>
                      <Field name="title">
                        {({ field, meta }: FieldProps) => (
                          <ChakraField
                            required
                            invalid={meta.touched && !!meta.error}
                            label="Title"
                          >
                            <Input id={field.name} {...field} />
                          </ChakraField>
                        )}
                      </Field>
                    </Box>
                    <Box>
                      <Field name="description">
                        {({ field, meta }: FieldProps) => (
                          <ChakraField
                            required
                            invalid={meta.touched && !!meta.error}
                            helperText="Few words about your subject."
                            label="Description"
                          >
                            <Textarea id={field.name} {...field} />
                          </ChakraField>
                        )}
                      </Field>
                    </Box>
                    <Stack direction="row" gap={5}>
                      <Box flex={1}>
                        <Field name="language">
                          {({ field, meta }: FieldProps) => (
                            <ChakraField
                              required
                              invalid={meta.touched && !!meta.error}
                              label="Spoken language"
                            >
                              <Select
                                {...field}
                                id={field.name}
                                name={field.name}
                                inputId={field.name}
                                getOptionLabel={({ label }) => label}
                                getOptionValue={({ value }) => value}
                                placeholder="Bryan is in the kitchen"
                                options={languageOptions}
                                onChange={(language) =>
                                  setFieldValue(field.name, language)
                                }
                              />
                            </ChakraField>
                          )}
                        </Field>
                      </Box>
                      <Box flex={1}>
                        <Field name="duration">
                          {({ field, meta }: FieldProps) => (
                            <ChakraField
                              required
                              invalid={meta.touched && !!meta.error}
                              label={`Duration : ${field.value} min`}
                            >
                              <Slider.Root
                                {...field}
                                name={field.name}
                                min={5}
                                max={120}
                                step={5}
                                padding={0}
                                display="block"
                                size="lg"
                                onValueChange={(event) => {
                                  if (event !== field.value) {
                                    setFieldValue(field.name, event.value);
                                  }
                                }}
                              >
                                <Slider.Control>
                                  <Slider.Track>
                                    <Slider.Range />
                                  </Slider.Track>

                                  <Slider.DraggingIndicator id={field.name}>
                                    <TimeIcon />
                                  </Slider.DraggingIndicator>
                                </Slider.Control>
                              </Slider.Root>
                            </ChakraField>
                          )}
                        </Field>
                      </Box>
                    </Stack>
                    <Box>
                      <FieldArray
                        name="speakers"
                        render={(arrayHelpers) => (
                          <ChakraField required label="Speaker(s)">
                            <SimpleGrid columns={2} gap={4}>
                              {values.speakers.map((speaker, speakerIndex) => (
                                <Stack
                                  key={`speakers.${speakerIndex}`}
                                  align="center"
                                  gap={1}
                                  direction="row"
                                >
                                  <Box flex={1}>
                                    <Field name={`speakers.${speakerIndex}`}>
                                      {({ field }: FieldProps) => {
                                        return (
                                          <SelectUserInput
                                            {...field}
                                            placeholder="You?"
                                            invalid={false}
                                            options={users.filter(
                                              (user) =>
                                                !values.speakers.find(
                                                  (selectedUser) =>
                                                    selectedUser?.id === user.id
                                                )
                                            )}
                                            name={field.name}
                                            inputId={field.name}
                                            value={field.value}
                                            onChange={(user) =>
                                              setFieldValue(
                                                `speakers.${speakerIndex}`,
                                                user
                                              )
                                            }
                                          />
                                        );
                                      }}
                                    </Field>
                                  </Box>

                                  {values.speakers.length > 1 && (
                                    <Button
                                      colorScheme="red"
                                      disabled={
                                        speakerIndex === 0 &&
                                        !values.speakers[speakerIndex + 1]
                                      }
                                      onClick={() =>
                                        arrayHelpers.remove(speakerIndex)
                                      }
                                    >
                                      -
                                    </Button>
                                  )}
                                </Stack>
                              ))}
                              <Button
                                disabled={!values.speakers.every(Boolean)}
                                onClick={() => arrayHelpers.push(null)}
                              >
                                Add a speaker <AddIcon />
                              </Button>
                            </SimpleGrid>
                          </ChakraField>
                        )}
                      />
                    </Box>

                    {!subjectHasBeenSelectedForNextTOAST && (
                      <Box>
                        <Field
                          name="status"
                          component={StatusField}
                          showHints={!alertAboutStatusChangeDuringVotingSession}
                        />
                      </Box>
                    )}

                    <Box>
                      <Field name="cover">
                        {({ field, meta }: FieldProps<FormValues["cover"]>) => {
                          const urlIsValid = !meta.error;

                          return (
                            <ChakraField label="Cover">
                              <Flex
                                position="relative"
                                align="center"
                                justify="center"
                                height="170px"
                                backgroundColor="gray.300"
                                backgroundRepeat="no-repeat"
                                backgroundPosition="center center"
                                backgroundSize="cover"
                                style={{
                                  backgroundImage: `url(${
                                    urlIsValid ? field.value : coverPlaceholder
                                  })`,
                                }}
                              >
                                <Group width="70%" mx="auto">
                                  <InputAddon>
                                    <FontAwesomeIcon icon={faImage} size="lg" />
                                  </InputAddon>
                                  <Input
                                    {...field}
                                    id={field.name}
                                    borderRadius="0"
                                    placeholder="Image URL"
                                    bg="white"
                                  />

                                  {field.value && urlIsValid && (
                                    <InputAddon>
                                      <CheckIcon color="green.500" />
                                    </InputAddon>
                                  )}

                                  {field.value && !urlIsValid && (
                                    <InputAddon>
                                      <WarningIcon color="red.500" />
                                    </InputAddon>
                                  )}
                                </Group>
                              </Flex>
                            </ChakraField>
                          );
                        }}
                      </Field>
                    </Box>

                    <Box>
                      <Field name="comment">
                        {({ field }: FieldProps) => (
                          <ChakraField
                            label="Side notes"
                            helperText="Use this field to elaborate on your subject, or simply explain why your talk may not be available yet."
                          >
                            <Input id={field.name} {...field} />
                          </ChakraField>
                        )}
                      </Field>
                    </Box>
                  </Stack>
                </Drawer.Body>

                <Drawer.Footer>
                  <Stack align="center" gap={3} direction="row">
                    <Button
                      overflow="hidden"
                      type="submit"
                      colorScheme="blue"
                      loading={isSubmitting}
                      disabled={!isValid}
                      loadingText={
                        isCreatingSubject
                          ? "Creating subject..."
                          : "Editing subject..."
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
                        {isCreatingSubject && "Add your subject"}
                        {!isCreatingSubject && "Edit subject"}
                      </Text>
                    </Button>
                    <Button
                      disabled={isSubmitting}
                      onClick={() => closeForm()}
                      overflow="hidden"
                      type="button"
                      colorScheme="red"
                      variant="outline"
                      mx={2}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer.Root>
          </FormikForm>
        );
      }}
    </Formik>
  );
};

export default observer(Form);
