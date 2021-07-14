import React, { FunctionComponent } from "react";
import { Badge } from "@chakra-ui/react";

import Image from "@web/core/components/Image";

const SubjectNewBadge: FunctionComponent = () => {
  return (
    <Badge variant="outline" colorScheme="red" position="relative" pl="30px">
      <Image
        position="absolute"
        src="https://media.giphy.com/media/KZXnlnHy0Bx33ecYcJ/giphy.gif"
        width={40}
        height={40}
        bottom="-2px"
        left="-6px"
      />
      New !
    </Badge>
  );
};

export default React.memo(SubjectNewBadge);
