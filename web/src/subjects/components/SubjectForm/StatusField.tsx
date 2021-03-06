import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FieldProps } from "formik";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Text,
  useTheme,
} from "@chakra-ui/react";

import { SubjectStatus } from "@shared/enums";

import { getStatusButtonStyleProps } from "@web/subjects/components/SubjectForm/helpers";

interface StatusBackgroundStyles {
  x: number;
  width: number;
  color: string;
}

const StatusInfos = {
  [SubjectStatus.AVAILABLE]: (
    <>
      You marked this subject as&nbsp;
      <Text as="span" fontWeight="bold">
        Available
      </Text>
      .
      <br />
      It will be automatically submitted to votes for the next TOAST.
    </>
  ),
  [SubjectStatus.UNAVAILABLE]: (
    <>
      You marked this subject as&nbsp;
      <Text as="span" fontWeight="bold">
        Unavailable
      </Text>
      &nbsp;⚠️
      <br />
      People won&apos;t be able to vote for this subject for all upcoming TOAST
      until you make it available again.
    </>
  ),
  [SubjectStatus.DONE]: (
    <>
      You marked this subject as&nbsp;
      <Text as="span" fontWeight="bold">
        Already given
      </Text>
      .
      <br />
      You already gave a talk about this subject in a previous TOAST.
      Congratulations!
    </>
  ),
};

interface Props extends FieldProps<SubjectStatus> {
  showHints?: boolean;
}

const StatusField: FunctionComponent<Props> = ({
  field,
  form,
  showHints = true,
}) => {
  const theme = useTheme();

  const [bgStyles, setBgStyles] = useState<StatusBackgroundStyles>({
    x: 0,
    width: 0,
    color: "transparent",
  });

  const rootElement = useRef() as React.MutableRefObject<HTMLDivElement>;

  const statusColors = useMemo(
    () => ({
      [SubjectStatus.AVAILABLE]: theme.colors.green["500"],
      [SubjectStatus.UNAVAILABLE]: theme.colors.red["500"],
      [SubjectStatus.DONE]: theme.colors.gray["500"],
    }),
    [theme.colors.green, theme.colors.red, theme.colors.gray]
  );

  /**
   * Effect for animating background.
   */
  useEffect(() => {
    const button = rootElement.current?.querySelector<HTMLButtonElement>(
      `button[value=${field.value}]`
    );

    if (button) {
      const x = button.offsetLeft;
      const width = button.offsetWidth;
      const color = statusColors[field.value];

      setBgStyles({
        x,
        width,
        color,
      });
    }
  }, [field.value, rootElement, statusColors]);

  const computeStatusButtonStyleProps = useMemo(() => {
    return getStatusButtonStyleProps(field);
  }, [field]);

  return (
    <FormControl ref={rootElement}>
      <Box>
        <FormLabel htmlFor={field.name}>Subject status</FormLabel>
      </Box>
      <Box
        position="relative"
        borderRadius={6}
        overflow="hidden"
        d="inline-block"
      >
        <Box
          position="absolute"
          width="1px"
          top={0}
          bottom={0}
          transition="all 400ms cubic-bezier(0.87, 0, 0.13, 1)"
          transformOrigin="left center"
          style={{
            transform: `translateX(${bgStyles.x}px) scaleX(${bgStyles.width})`,
            backgroundColor: bgStyles.color,
          }}
        />
        <ButtonGroup isAttached variant="outline">
          <Button
            type="button"
            mr="-1px"
            onClick={() => {
              form.setFieldValue(field.name, SubjectStatus.AVAILABLE);
            }}
            {...computeStatusButtonStyleProps(SubjectStatus.AVAILABLE)}
          >
            Available
          </Button>
          <Button
            type="button"
            mr="-1px"
            onClick={() => {
              form.setFieldValue(field.name, SubjectStatus.UNAVAILABLE);
            }}
            {...computeStatusButtonStyleProps(SubjectStatus.UNAVAILABLE)}
          >
            Unavailable
          </Button>
          <Button
            type="button"
            onClick={() => {
              form.setFieldValue(field.name, SubjectStatus.DONE);
            }}
            {...computeStatusButtonStyleProps(SubjectStatus.DONE)}
          >
            Already given
          </Button>
        </ButtonGroup>
      </Box>

      {showHints && (
        <Text mt={2} fontSize="sm">
          {StatusInfos[field.value]}
        </Text>
      )}
    </FormControl>
  );
};

export default StatusField;
