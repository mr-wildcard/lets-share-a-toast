import React, { FC } from "react";
import { Badge } from "@chakra-ui/react";

import { SubjectLanguage } from "@shared/enums";

const languageFlags = {
  [SubjectLanguage.FR]: "🥖",
  [SubjectLanguage.EN]: "🇬🇧",
};

const languageLabels = {
  [SubjectLanguage.FR]: "Français",
  [SubjectLanguage.EN]: "English",
};

interface Props {
  language: SubjectLanguage;
}

const SubjectLanguageBadge: FC<Props> = ({ language }) => {
  return (
    <Badge
      display="flex"
      alignItems="center"
      variant="outline"
      colorScheme="blue"
      fontWeight="bold"
    >
      {languageFlags[language]} {languageLabels[language]}
    </Badge>
  );
};

export default React.memo(SubjectLanguageBadge);
