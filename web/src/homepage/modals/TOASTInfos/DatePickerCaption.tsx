import React, { FC } from "react";
import { Text } from "@chakra-ui/react";
import { CaptionElementProps } from "react-day-picker";
import day from "dayjs";

import css from "./DatePicker.module.css";

const DatePickerCaption: FC<CaptionElementProps> = ({ date }) => {
  const parsedDate = day(date);
  const month = parsedDate.get("month");

  return (
    <Text
      fontSize="lg"
      className={css.caption}
      fontWeight="bold"
      textAlign="center"
      py={2}
    >
      {month === 11 && "🎄"}
      {parsedDate.format("MMMM YYYY")}
      {month === 11 && " 🎅"}
    </Text>
  );
};

export default DatePickerCaption;
