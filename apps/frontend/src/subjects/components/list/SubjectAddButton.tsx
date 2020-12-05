import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Image from 'frontend/core/components/Image';

interface Props {
  creatingSubject: boolean;
  onClick(): void;
}

const SubjectAddButton: FunctionComponent<Props> = ({
  creatingSubject,
  onClick,
}) => {
  return (
    <C.Button
      position="relative"
      variant="outline"
      colorScheme="gray"
      borderColor="black"
      onClick={onClick}
      isDisabled={creatingSubject}
      w="100%"
      h="auto"
      p={5}
      fontWeight="bold"
      fontSize="lg"
      textTransform="uppercase"
      bg="white"
    >
      {creatingSubject && (
        <Image
          src="https://media.giphy.com/media/2ieYd6DY1iS8y4arB2/giphy.gif"
          position="absolute"
          width={140}
          height={140}
          bottom="-30px"
        />
      )}

      <C.Flex
        as={C.Text}
        align="center"
        m={0}
        visibility={creatingSubject ? 'hidden' : 'visible'}
      >
        <C.Text as="span" pr={3}>
          <FontAwesomeIcon icon={faPlus} size="2x" />
        </C.Text>
        <C.Text as="span">Add your subject</C.Text>
      </C.Flex>
    </C.Button>
  );
};

export default SubjectAddButton;
