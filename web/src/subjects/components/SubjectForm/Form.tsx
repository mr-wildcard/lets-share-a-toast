import firebase from "firebase/app";
import React, { FunctionComponent, useMemo } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  DrawerBody,
  DrawerCloseButton,
  DrawerHeader,
  DrawerFooter,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Textarea,
  useTheme,
} from "@chakra-ui/react";
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

import { firebaseData } from "@web/core/firebase/data";
import { pageColors } from "@web/core/constants";
import { getTOASTRemainingDays } from "@web/core/helpers/timing";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import SelectUserInput from "@web/core/components/form/SelectUserInput";
import subjectIsInVotingSession from "@web/core/helpers/subjectIsInVotingSession";
import SubjectStatusBadge from "@web/subjects/components/list/item/SubjectStatusBadge";
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

const Form: FunctionComponent<Props> = ({ subject, closeForm }) => {
  const theme = useTheme();
  const { currentToast, users, connectedUser } = firebaseData;

  const isCreatingSubject = !subject;

  const warnAboutNewSubjectDuringVotingSession = useMemo(() => {
    return (
      isCreatingSubject && currentToast?.status === ToastStatus.OPEN_FOR_VOTE
    );
  }, [isCreatingSubject, currentToast]);

  const alertAboutStatusChange = useMemo(() => {
    return (
      !isCreatingSubject &&
      !!currentToast &&
      subjectIsInVotingSession(currentToast.status, subject!.status)
    );
  }, [isCreatingSubject, currentToast, subject]);

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

        let input = {
          title: values.title,
          speakersIds: speakers.map((speaker) => speaker.id),
          description: values.description,
          duration: values.duration,
          language: values.language.value,
          comment: values.comment,
          cover: values.cover,
          status: values.status,
          createdDate: isCreatingSubject
            ? firebase.firestore.FieldValue.serverTimestamp()
            : subject?.createdDate,
          createdByUserId: isCreatingSubject
            ? firebaseData.connectedUser?.uid
            : subject?.createdByUser.id,
          lastModifiedDate: firebase.firestore.FieldValue.serverTimestamp(),
          lastModifiedByUserId: firebaseData.connectedUser?.uid,
        };

        if (isCreatingSubject) {
          return firebase
            .firestore()
            .collection(FirestoreCollection.SUBJECTS)
            .add(input)
            .then(() => closeForm())
            .catch((error) => {
              console.error(
                "Couldn't create subject because of Firebase error :",
                error
              );
            });
        } else {
          return firebase
            .firestore()
            .collection(FirestoreCollection.SUBJECTS)
            .doc(subject?.id)
            .set(input)
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
        validateForm,
      }: FormikProps<FormValues>) => {
        return (
          <FormikForm>
            <DrawerHeader>
              <Flex wrap="nowrap" align="start">
                <Flex align="center" justify="center" mx="auto">
                  <Text textAlign="center" wordBreak="break-word">
                    <HighlightedText
                      d="inline-block"
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
                <DrawerCloseButton padding={2} />
              </Flex>
            </DrawerHeader>

            <DrawerBody>
              <Box mb={5}>
                {warnAboutNewSubjectDuringVotingSession && (
                  <Alert status="warning" variant="left-accent">
                    <AlertIcon />
                    <Box flex="1">
                      <AlertTitle fontSize="lg">
                        You're about to create a new subject: that's great! But
                        be advised...
                      </AlertTitle>
                      <AlertDescription>
                        A voting session for the next TOAST coming&nbsp;
                        {getTOASTRemainingDays(new Date(currentToast!.date))}
                        &nbsp;is currently opened. If you submit this subject
                        with the&nbsp;
                        <SubjectStatusBadge status={SubjectStatus.AVAILABLE} />
                        &nbsp;status, it will be automatically added to it.
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}
                {alertAboutStatusChange && (
                  <Alert status="error" variant="left-accent">
                    <AlertIcon />
                    <Box flex="1">
                      <AlertTitle fontSize="lg">Watch out!</AlertTitle>
                      <AlertDescription>
                        <Text>
                          This subject is currently in the voting session for
                          the next TOAST!
                        </Text>
                        <Text>
                          Changing its status to something else than&nbsp;
                          <SubjectStatusBadge status={subject!.status} />
                          &nbsp;will make it lose all its votes!
                        </Text>
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}
              </Box>

              <Stack spacing={8}>
                <Box>
                  <Field name="title">
                    {({ field, meta }: FieldProps) => (
                      <FormControl
                        isRequired
                        isInvalid={meta.touched && !!meta.error}
                      >
                        <FormLabel htmlFor={field.name}>Title</FormLabel>
                        <Input id={field.name} {...field} />
                      </FormControl>
                    )}
                  </Field>
                </Box>
                <Box>
                  <Field name="description">
                    {({ field, meta }: FieldProps) => (
                      <FormControl
                        isRequired
                        isInvalid={meta.touched && !!meta.error}
                      >
                        <FormLabel htmlFor={field.name}>Description</FormLabel>
                        <Textarea id={field.name} {...field} />
                        <FormHelperText id={field.name}>
                          Few words about your subject.
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Field>
                </Box>
                <Stack direction="row" spacing={5}>
                  <Box flex={1}>
                    <Field name="language">
                      {({ field, meta }: FieldProps) => (
                        <FormControl
                          isRequired
                          isInvalid={meta.touched && !!meta.error}
                        >
                          <FormLabel htmlFor={field.name}>
                            Spoken language
                          </FormLabel>
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
                        </FormControl>
                      )}
                    </Field>
                  </Box>
                  <Box flex={1}>
                    <Field name="duration">
                      {({ field, meta }: FieldProps) => (
                        <FormControl
                          isRequired
                          isInvalid={meta.touched && !!meta.error}
                        >
                          <FormLabel htmlFor={field.name}>
                            Duration : {field.value} min
                          </FormLabel>
                          <Slider
                            {...field}
                            name={field.name}
                            min={5}
                            max={120}
                            step={5}
                            p={0}
                            height={theme.space["10"]}
                            d="block"
                            size="lg"
                            onChange={(value) => {
                              if (value !== field.value) {
                                setFieldValue(field.name, value);
                              }
                            }}
                          >
                            <SliderTrack>
                              <SliderFilledTrack />
                            </SliderTrack>

                            <SliderThumb id={field.name}>
                              <TimeIcon />
                            </SliderThumb>
                          </Slider>
                        </FormControl>
                      )}
                    </Field>
                  </Box>
                </Stack>
                <Box>
                  <FieldArray
                    name="speakers"
                    render={(arrayHelpers) => (
                      <FormControl isRequired>
                        <FormLabel htmlFor="speakers.0">Speaker(s)</FormLabel>
                        <SimpleGrid columns={2} spacing={4}>
                          {values.speakers.map((speaker, speakerIndex) => (
                            <Stack
                              key={`speakers.${speakerIndex}`}
                              align="center"
                              spacing={1}
                              direction="row"
                            >
                              <Box flex={1}>
                                <Field name={`speakers.${speakerIndex}`}>
                                  {({ field }: FieldProps) => {
                                    return (
                                      <SelectUserInput
                                        {...field}
                                        placeholder="You?"
                                        isInvalid={false}
                                        options={users.filter(
                                          (user) =>
                                            !values.speakers.find(
                                              (selectedUser) =>
                                                selectedUser &&
                                                selectedUser.id === user.id
                                            )
                                        )}
                                        name={field.name}
                                        inputId={field.name}
                                        value={field.value}
                                        onChange={(profile: User | null) =>
                                          setFieldValue(
                                            `speakers.${speakerIndex}`,
                                            profile
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
                                  isDisabled={
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
                            rightIcon={<AddIcon />}
                            isDisabled={!values.speakers.every(Boolean)}
                            onClick={() => arrayHelpers.push(null)}
                          >
                            Add a speaker
                          </Button>
                        </SimpleGrid>
                      </FormControl>
                    )}
                  />
                </Box>
                <Box>
                  <Field
                    name="status"
                    component={StatusField}
                    showHints={!alertAboutStatusChange}
                  />
                </Box>
                <Box>
                  <Field name="cover">
                    {({ field, meta }: FieldProps<FormValues["cover"]>) => {
                      const urlIsValid = !meta.error;

                      return (
                        <FormControl>
                          <FormLabel htmlFor={field.name}>Cover</FormLabel>
                          <Flex
                            position="relative"
                            align="center"
                            justify="center"
                            height="170px"
                            marginLeft={`-${theme.space["6"]}`}
                            marginRight={`-${theme.space["6"]}`}
                            backgroundColor={theme.colors.gray["300"]}
                            backgroundImage={`url(${
                              urlIsValid ? field.value : coverPlaceholder
                            })`}
                            backgroundRepeat="no-repeat"
                            backgroundPosition="center center"
                            backgroundSize="cover"
                          >
                            <InputGroup width="70%" mx="auto">
                              <InputLeftAddon>
                                <FontAwesomeIcon icon={faImage} size="lg" />
                              </InputLeftAddon>
                              <Input
                                {...field}
                                id={field.name}
                                borderRadius="0"
                                placeholder="Image URL"
                                bg="white"
                              />
                              {field.value && urlIsValid && (
                                <InputRightAddon>
                                  <CheckIcon color="green.500" />
                                </InputRightAddon>
                              )}

                              {field.value && !urlIsValid && (
                                <InputRightAddon>
                                  <WarningIcon color="red.500" />
                                </InputRightAddon>
                              )}
                            </InputGroup>
                          </Flex>
                        </FormControl>
                      );
                    }}
                  </Field>
                </Box>

                <Box>
                  <Field name="comment">
                    {({ field }: FieldProps) => (
                      <FormControl>
                        <FormLabel htmlFor={field.name}>Side notes</FormLabel>
                        <Input id={field.name} {...field} />
                        <FormHelperText id={field.name}>
                          Use this field to elaborate on your subject, or simply
                          explain why your talk may not be available yet.
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Field>
                </Box>
              </Stack>
            </DrawerBody>

            <DrawerFooter>
              <Stack align="center" spacing={3} direction="row">
                <Button
                  overflow="hidden"
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  isDisabled={!isValid}
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
                  isDisabled={isSubmitting}
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
            </DrawerFooter>
          </FormikForm>
        );
      }}
    </Formik>
  );
};

export default observer(Form);
