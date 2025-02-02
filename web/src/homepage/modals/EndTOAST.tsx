import React, { FC, useRef } from "react";
import {
  Alert,
  Box,
  Button,
  Separator,
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
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@web/components/ui/dialog";

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

const EndTOAST: FC<Props> = ({ currentToast, closeModal }) => {
  const cancelBtn = useRef<HTMLButtonElement>(null);

  const [gray600, green500] = useToken("colors", ["gray.600", "green.500"]);

  const [sm] = useToken("sizes", ["sm"]);

  return (
    <DialogRoot
      placement="center"
      open={true}
      initialFocusEl={() => cancelBtn.current}
      onOpenChange={closeModal}
      size="xl"
    >
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
        {({ values, isValid, isSubmitting }: FormikProps<FormValues>) => {
          return (
            <Form>
              <DialogContent borderRadius="3px">
                <DialogHeader textAlign="center">
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
                </DialogHeader>
                <DialogBody fontSize="lg">
                  <Box mb={5}>
                    <Alert.Root status="info">
                      <Alert.Content flex={1}>
                        <Alert.Description>
                          In order to end the TOAST, you need to specify which
                          subject(s) has been given (at least one subject).
                          <br />
                          If no subject has been given, you might want to cancel
                          the TOAST instead.
                        </Alert.Description>
                      </Alert.Content>
                    </Alert.Root>
                  </Box>

                  <Separator my={5} />

                  <Stack my={10} gap={5}>
                    {currentToast.selectedSubjects.map(
                      (selectedSubject, index) => {
                        const subjectIsSelected =
                          values.givenSubjectsIds.includes(selectedSubject.id);

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
                              <Button
                                key={`subject-${selectedSubject.id}`}
                                padding={3}
                                borderRadius="md"
                                borderWidth="1px"
                                borderStyle="solid"
                                borderColor="gray.200"
                                style={{
                                  color: subjectIsSelected ? "white" : gray600,
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
                              </Button>
                            )}
                          </Field>
                        );
                      }
                    )}
                  </Stack>
                </DialogBody>
                <DialogFooter justifyContent="center">
                  <Stack gap={3} direction="row">
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting || !isValid}
                      loadingText="Ending TOAST..."
                      colorPalette="green"
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
                </DialogFooter>
              </DialogContent>
            </Form>
          );
        }}
      </Formik>
    </DialogRoot>
  );
};

export default EndTOAST;
