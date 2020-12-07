import React, { FunctionComponent, useEffect } from 'react';
import * as C from '@chakra-ui/react';
import { AddIcon, TimeIcon, CheckIcon, WarningIcon } from '@chakra-ui/icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import {
  Field,
  FieldArray,
  FieldProps,
  Formik,
  FormikProps,
  Form as FormikForm,
} from 'formik';
import { toJS } from 'mobx';
import Select from 'react-select';

import {
  SubjectStatus,
  SubjectLanguage,
  Subject,
  User,
} from '@letsshareatoast/shared';

import http from 'frontend/core/httpClient';
import NotificationType from 'frontend/notifications/types/NotificationType';
import useStores from 'frontend/core/hooks/useStores';
import { APIPaths, pageColors, urlRegex } from 'frontend/core/constants';
import HighlightedText from 'frontend/core/components/HighlightedText';
import Image from 'frontend/core/components/Image';
import SelectUserInput from 'frontend/core/components/form/SelectUserInput';
import StatusField from './StatusField';

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
  subject: Subject;
  allUsers: User[];
  revalidateSubjects(): Promise<boolean>;
  closeForm(): void;
}

const coverPlaceholder =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8XQ8AAhsBTLgo62UAAAAASUVORK5CYII=';

const languageOptions: LanguageValue[] = [
  {
    label: 'Français',
    value: SubjectLanguage.FR,
  },
  {
    label: 'English',
    value: SubjectLanguage.EN,
  },
];

const Form: FunctionComponent<Props> = ({
  subject,
  allUsers,
  closeForm,
  revalidateSubjects,
}) => {
  const { auth, notifications } = useStores();
  const theme = C.useTheme();

  const isCreatingSubject = !subject;

  return (
    <Formik
      initialValues={{
        title: isCreatingSubject ? '' : subject.title,
        description: isCreatingSubject ? '' : subject.description,
        language: isCreatingSubject
          ? languageOptions[0]
          : languageOptions.find((option) => option.value === subject.language),
        duration: isCreatingSubject ? 30 : subject.duration,
        speakers: isCreatingSubject ? [toJS(auth.profile)] : subject.speakers,
        cover: isCreatingSubject ? '' : subject.cover || '',
        comment: isCreatingSubject ? '' : subject.comment || '',
        status: isCreatingSubject ? SubjectStatus.AVAILABLE : subject.status,
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

        if (values.cover.length > 0 && !urlRegex.test(values.cover)) {
          errors.cover = true;
        }

        return errors;
      }}
      onSubmit={async (values: FormValues) => {
        /**
         * When adding a Field for a new speaker, its default value is `null`.
         * If the form is submitted without selecting a user in the select input,
         * `null` value arrives here in the submit callback
         * and we need to get rid of it.
         */
        const speakers = values.speakers.filter(Boolean);

        const input = {
          title: values.title,
          speakers: speakers.map((speaker) => speaker.id),
          description: values.description,
          duration: values.duration,
          language: values.language.value,
          comment: values.comment,
          cover: values.cover,
          status: values.status,
        };

        const request = http();

        if (isCreatingSubject) {
          await request(APIPaths.SUBJECTS, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
          });

          notifications.send(auth.profile, NotificationType.ADD_SUBJECT, {
            subjectTitle: values.title,
          });
        } else {
          await request(APIPaths.SUBJECT.replace(':id', subject.id), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
          });

          notifications.send(
            auth.profile,
            NotificationType.EDIT_SUBJECT_CONTENT,
            {
              subjectTitle: subject.title,
            }
          );
        }

        await revalidateSubjects();

        closeForm();
      }}
    >
      {({
        values,
        setFieldValue,
        isSubmitting,
        isValid,
        validateForm,
      }: FormikProps<FormValues>) => {
        // https://github.com/formium/formik/issues/1950
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          validateForm();
        }, [validateForm]);

        return (
          <C.DrawerContent overflowY="auto">
            <C.DrawerCloseButton />
            <FormikForm>
              <C.DrawerHeader>
                <C.Flex align="center" justify="center">
                  <C.Text textAlign="center" wordBreak="break-word">
                    <HighlightedText
                      d="inline-block"
                      bgColor={pageColors.subjects}
                      animDelay={500}
                    >
                      {isCreatingSubject
                        ? values.title.length
                          ? `Creating new subject: "${values.title}"`
                          : 'Creating a new subject'
                        : `Editing subject: "${subject.title}"`}
                    </HighlightedText>
                  </C.Text>
                  <Image
                    transform="translateY(-3px)"
                    width={141}
                    height={65}
                    src="https://media.giphy.com/media/3og0IARm07OVhdM8a4/giphy.webp"
                  />
                </C.Flex>
              </C.DrawerHeader>

              <C.DrawerBody>
                <C.Stack spacing={8}>
                  <C.Box>
                    <Field name="title">
                      {({ field, meta }: FieldProps) => (
                        <C.FormControl
                          isRequired
                          isInvalid={meta.touched && !!meta.error}
                        >
                          <C.FormLabel htmlFor={field.name}>Title</C.FormLabel>
                          <C.Input id={field.name} {...field} />
                        </C.FormControl>
                      )}
                    </Field>
                  </C.Box>
                  <C.Box>
                    <Field name="description">
                      {({ field, meta }: FieldProps) => (
                        <C.FormControl
                          isRequired
                          isInvalid={meta.touched && !!meta.error}
                        >
                          <C.FormLabel htmlFor={field.name}>
                            Description
                          </C.FormLabel>
                          <C.Textarea id={field.name} {...field} />
                          <C.FormHelperText id={field.name}>
                            Few words about your subject.
                          </C.FormHelperText>
                        </C.FormControl>
                      )}
                    </Field>
                  </C.Box>
                  <C.Stack direction="row" spacing={5}>
                    <C.Box flex={1}>
                      <Field name="language">
                        {({ field, meta }: FieldProps) => (
                          <C.FormControl
                            isRequired
                            isInvalid={meta.touched && !!meta.error}
                          >
                            <C.FormLabel htmlFor={field.name}>
                              Spoken language
                            </C.FormLabel>
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
                                setFieldValue('language', language)
                              }
                            />
                          </C.FormControl>
                        )}
                      </Field>
                    </C.Box>
                    <C.Box flex={1}>
                      <Field name="duration">
                        {({ field, meta }: FieldProps) => (
                          <C.FormControl
                            isRequired
                            isInvalid={meta.touched && !!meta.error}
                          >
                            <C.FormLabel htmlFor={field.name}>
                              Duration : {field.value} min
                            </C.FormLabel>
                            <C.Slider
                              {...field}
                              name={field.name}
                              min={5}
                              max={120}
                              step={5}
                              p={0}
                              height={theme.space['10']}
                              d="block"
                              size="lg"
                              onChange={(value) => {
                                if (value !== field.value) {
                                  setFieldValue('duration', value);
                                }
                              }}
                            >
                              <C.SliderTrack>
                                <C.SliderFilledTrack />
                              </C.SliderTrack>

                              <C.SliderThumb id={field.name}>
                                <TimeIcon />
                              </C.SliderThumb>
                            </C.Slider>
                          </C.FormControl>
                        )}
                      </Field>
                    </C.Box>
                  </C.Stack>
                  <C.Box>
                    <FieldArray
                      name="speakers"
                      render={(arrayHelpers) => (
                        <C.FormControl isRequired>
                          <C.FormLabel htmlFor="speakers.0">
                            Speaker(s)
                          </C.FormLabel>
                          <C.SimpleGrid columns={2} spacing={4}>
                            {values.speakers.map((speaker, speakerIndex) => (
                              <C.Stack
                                key={`speakers.${speakerIndex}`}
                                align="center"
                                spacing={1}
                                direction="row"
                              >
                                <C.Box flex={1}>
                                  <Field name={`speakers.${speakerIndex}`}>
                                    {({ field }: FieldProps) => {
                                      return (
                                        <SelectUserInput
                                          {...field}
                                          placeholder="You?"
                                          isInvalid={false}
                                          options={allUsers.filter(
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
                                          onChange={(profile: User) =>
                                            setFieldValue(
                                              // @ts-ignore
                                              `speakers.${speakerIndex}`,
                                              profile
                                            )
                                          }
                                        />
                                      );
                                    }}
                                  </Field>
                                </C.Box>

                                {values.speakers.length > 1 && (
                                  <C.Button
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
                                  </C.Button>
                                )}
                              </C.Stack>
                            ))}
                            <C.Button
                              rightIcon={<AddIcon />}
                              isDisabled={!values.speakers.every(Boolean)}
                              onClick={() => arrayHelpers.push(null)}
                            >
                              Add a speaker
                            </C.Button>
                          </C.SimpleGrid>
                        </C.FormControl>
                      )}
                    />
                  </C.Box>
                  <C.Box>
                    <Field name="status" component={StatusField} />
                  </C.Box>
                  <C.Box>
                    <Field name="cover">
                      {({ field }) => {
                        const urlIsValid = urlRegex.test(field.value);

                        return (
                          <C.FormControl>
                            <C.FormLabel htmlFor={field.name}>
                              Cover
                            </C.FormLabel>
                            <C.Flex
                              position="relative"
                              align="center"
                              justify="center"
                              height="170px"
                              marginLeft={`-${theme.space['6']}`}
                              marginRight={`-${theme.space['6']}`}
                              backgroundImage={`url(${
                                urlIsValid ? field.value : coverPlaceholder
                              })`}
                              backgroundRepeat="no-repeat"
                              backgroundPosition="center center"
                              backgroundSize="cover"
                            >
                              <C.InputGroup width="70%" mx="auto">
                                <C.InputLeftAddon>
                                  <FontAwesomeIcon icon={faImage} size="lg" />
                                </C.InputLeftAddon>
                                <C.Input
                                  {...field}
                                  id={field.name}
                                  borderRadius="0"
                                  placeholder="Insert an external URL of an image"
                                />
                                {urlIsValid && (
                                  <C.InputRightAddon>
                                    <CheckIcon color="green.500" />
                                  </C.InputRightAddon>
                                )}

                                {field.value.length > 0 && !urlIsValid && (
                                  <C.InputRightAddon>
                                    <WarningIcon color="red.500" />
                                  </C.InputRightAddon>
                                )}
                              </C.InputGroup>
                            </C.Flex>
                          </C.FormControl>
                        );
                      }}
                    </Field>
                  </C.Box>

                  <C.Box>
                    <Field name="comment">
                      {({ field }: FieldProps) => (
                        <C.FormControl>
                          <C.FormLabel htmlFor={field.name}>
                            Side notes
                          </C.FormLabel>
                          <C.Input id={field.name} {...field} />
                          <C.FormHelperText id={field.name}>
                            Use this field to elaborate on your subject, or
                            simply explain why your talk may not be available
                            yet.
                          </C.FormHelperText>
                        </C.FormControl>
                      )}
                    </Field>
                  </C.Box>
                </C.Stack>
              </C.DrawerBody>

              <C.DrawerFooter>
                <C.Stack align="center" spacing={3} direction="row">
                  <C.Button
                    overflow="hidden"
                    type="submit"
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    isDisabled={!isValid}
                    loadingText={
                      isCreatingSubject
                        ? 'Creating subject...'
                        : 'Editing subject...'
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
                      {isCreatingSubject && 'Add your subject'}
                      {!isCreatingSubject && 'Edit subject'}
                    </C.Text>
                  </C.Button>
                  <C.Button
                    isDisabled={isSubmitting}
                    onClick={() => closeForm()}
                    overflow="hidden"
                    type="button"
                    colorScheme="red"
                    variant="outline"
                    mx={2}
                  >
                    Cancel
                  </C.Button>
                </C.Stack>
              </C.DrawerFooter>
            </FormikForm>
          </C.DrawerContent>
        );
      }}
    </Formik>
  );
};

export default Form;
