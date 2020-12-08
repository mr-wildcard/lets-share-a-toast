import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FieldProps } from 'formik';
import * as C from '@chakra-ui/react';

import { SubjectStatus } from '@letsshareatoast/shared';

import { getStatusButtonStyleProps } from 'frontend/subjects/components/SubjectForm/helpers';

interface StatusBackgroundStyles {
  x: number;
  width: number;
  color: string;
}

const StatusInfos = {
  [SubjectStatus.AVAILABLE]: (
    <>
      You marked this subject as&nbsp;
      <C.Text as="span" fontWeight="bold">
        Available
      </C.Text>
      .
      <br />
      It will be automatically submitted to votes for the next TOAST.
    </>
  ),
  [SubjectStatus.UNAVAILABLE]: (
    <>
      You marked this subject as&nbsp;
      <C.Text as="span" fontWeight="bold">
        Unavailable
      </C.Text>
      &nbsp;⚠️
      <br />
      People won&apos;t be able to vote for this subject for all upcoming TOAST
      until you make it available again.
    </>
  ),
  [SubjectStatus.DONE]: (
    <>
      You marked this subject as&nbsp;
      <C.Text as="span" fontWeight="bold">
        Already given
      </C.Text>
      .
      <br />
      You already gave a talk about this subject in a previous TOAST.
      Congratulations!
    </>
  ),
};

const StatusField: FunctionComponent<FieldProps> = ({ field, form }) => {
  const theme = C.useTheme();

  const [bgStyles, setBgStyles] = useState<StatusBackgroundStyles>({
    x: 0,
    width: 0,
    color: 'transparent',
  });

  const rootElement = useRef<HTMLDivElement>();

  const statusColors = useMemo(
    () => ({
      [SubjectStatus.AVAILABLE]: theme.colors.green['500'],
      [SubjectStatus.UNAVAILABLE]: theme.colors.red['500'],
      [SubjectStatus.DONE]: theme.colors.gray['500'],
    }),
    [theme.colors.green, theme.colors.red, theme.colors.gray]
  );

  /**
   * Effect for animating background.
   */
  useEffect(() => {
    const button = rootElement.current.querySelector<HTMLButtonElement>(
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
    <C.FormControl ref={rootElement}>
      <C.Box>
        <C.FormLabel htmlFor={field.name}>Subject status</C.FormLabel>
      </C.Box>
      <C.Box
        position="relative"
        borderRadius={8}
        overflow="hidden"
        d="inline-block"
      >
        <C.Box
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
        <C.ButtonGroup isAttached variant="outline">
          <C.Button
            mr="-1px"
            onClick={() => {
              form.setFieldValue(field.name, SubjectStatus.AVAILABLE);
            }}
            {...computeStatusButtonStyleProps(SubjectStatus.AVAILABLE)}
          >
            Available
          </C.Button>
          <C.Button
            mr="-1px"
            onClick={() => {
              form.setFieldValue(field.name, SubjectStatus.UNAVAILABLE);
            }}
            {...computeStatusButtonStyleProps(SubjectStatus.UNAVAILABLE)}
          >
            Unavailable
          </C.Button>
          <C.Button
            onClick={() => {
              form.setFieldValue(field.name, SubjectStatus.DONE);
            }}
            {...computeStatusButtonStyleProps(SubjectStatus.DONE)}
          >
            Already given
          </C.Button>
        </C.ButtonGroup>
      </C.Box>
      <C.Text mt={2} fontSize="sm">
        {StatusInfos[field.value]}
      </C.Text>
    </C.FormControl>
  );
};

export default StatusField;
