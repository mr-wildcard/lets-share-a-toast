import React, { FunctionComponent, useRef } from "react";
import {
  Alert,
  AlertDescription,
  AlertDialogBody,
  AlertDialogFooter,
  Box,
  Button,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useToken,
} from "@chakra-ui/react";
import { Form, Formik, Field, FormikProps, FieldProps } from "formik";

import { Toast } from "@shared/models";

import { pageColors } from "@web/core/constants";
import { getSubjectSpeakersAsText } from "@web/core/helpers/getSubjectSpeakersAsText";
import { getCloudFunctionEndTOAST } from "@web/core/firebase/helpers";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";

interface FormErrors {
  givenSubjectsIds?: boolean;
}

interface FormValues {
  givenSubjectsIds: string[];
}

interface Props {
  currentToast: Toast;
  closeModal(): void;
}

const EndTOAST: FunctionComponent<Props> = ({ currentToast, closeModal }) => {
  const cancelBtn = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const [gray600, green500] = useToken("colors", ["gray.600", "green.500"]);

  const [sm] = useToken("sizes", ["sm"]);

  return (
    <Modal
      isCentered
      isOpen={true}
      initialFocusRef={cancelBtn}
      onClose={closeModal}
      size="xl"
    >
      <ModalOverlay>
        <Formik
          validateOnMount={true}
          initialValues={{
            givenSubjectsIds: [],
          }}
          validate={(values: FormValues): FormErrors => {
            const errors: FormErrors = {};

            if (!values.givenSubjectsIds.length) {
              errors.givenSubjectsIds = true;
            }

            return errors;
          }}
          onSubmit={async (values: FormValues): Promise<void> => {
            const endToast = getCloudFunctionEndTOAST();

            return endToast(values).then(closeModal);
          }}
        >
          {({
            values,
            isValid,
            isSubmitting,
            errors,
          }: FormikProps<FormValues>) => {
            return (
              <Form>
                <ModalContent borderRadius="3px">
                  <ModalHeader textAlign="center">
                    <Text position="relative" pr={5}>
                      <HighlightedText bgColor={pageColors.homepage}>
                        End current TOAST
                      </HighlightedText>
                      <Image
                        position="absolute"
                        right="-10px"
                        bottom="-34px"
                        zIndex={1}
                        width={120}
                        height={120}
                        src="https://media.giphy.com/media/RLVLZDCYkjrdwlUQSt/giphy.webp"
                      />
                    </Text>
                  </ModalHeader>
                  <AlertDialogBody fontSize="lg">
                    <Box mb={5}>
                      <Alert status="info" variant="left-accent">
                        <Box flex={1}>
                          <AlertDescription>
                            In order to end the TOAST, you need to specify which
                            subject(s) has been given (at least one subject).
                            <br />
                            If no subject has been given, you might want to
                            cancel the TOAST instead.
                          </AlertDescription>
                        </Box>
                      </Alert>
                    </Box>

                    <Divider my={5} />

                    <Stack my={10} spacing={5}>
                      {currentToast.selectedSubjects.map(
                        (selectedSubject, index) => {
                          const subjectIsSelected =
                            values.givenSubjectsIds.includes(
                              selectedSubject.id
                            );

                          return (
                            <Field
                              key={`${selectedSubject.id}-${index}`}
                              name="givenSubjectsIds"
                            >
                              {({
                                field,
                                form,
                              }: FieldProps<
                                FormValues["givenSubjectsIds"],
                                FormValues
                              >) => (
                                <Box
                                  as="button"
                                  type="button"
                                  key={`subject-${selectedSubject.id}`}
                                  p={3}
                                  borderRadius="md"
                                  borderWidth="1px"
                                  borderStyle="solid"
                                  borderColor="gray.200"
                                  style={{
                                    color: subjectIsSelected
                                      ? "white"
                                      : gray600,
                                    backgroundColor: subjectIsSelected
                                      ? green500
                                      : "white",
                                    boxShadow: subjectIsSelected ? "none" : sm,
                                  }}
                                  onClick={() => {
                                    if (
                                      values.givenSubjectsIds.includes(
                                        selectedSubject.id
                                      )
                                    ) {
                                      form.setFieldValue(
                                        field.name,
                                        field.value.filter(
                                          (subjectId: string) =>
                                            subjectId !== selectedSubject.id
                                        )
                                      );
                                    } else {
                                      form.setFieldValue(
                                        field.name,
                                        field.value.concat(selectedSubject.id)
                                      );
                                    }
                                  }}
                                >
                                  <Text
                                    as="span"
                                    fontWeight="bold"
                                    fontStyle="italic"
                                  >
                                    "{selectedSubject.title}"
                                  </Text>
                                  &nbsp;by&nbsp;
                                  {getSubjectSpeakersAsText(
                                    selectedSubject.speakers
                                  )}
                                </Box>
                              )}
                            </Field>
                          );
                        }
                      )}
                    </Stack>
                  </AlertDialogBody>
                  <AlertDialogFooter justifyContent="center">
                    <Stack spacing={3} direction="row">
                      <Button
                        type="submit"
                        isLoading={isSubmitting}
                        isDisabled={isSubmitting || !isValid}
                        loadingText="Ending TOAST..."
                        colorScheme="green"
                      >
                        I do want to end the TOAST
                      </Button>
                      <Button
                        position="relative"
                        overflow="hidden"
                        ref={cancelBtn}
                        onClick={closeModal}
                      >
                        Do nothing
                      </Button>
                    </Stack>
                  </AlertDialogFooter>
                </ModalContent>
              </Form>
            );
          }}
        </Formik>
      </ModalOverlay>
    </Modal>
  );
};

export default EndTOAST;
