import React from 'react';
import * as C from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';

import { Pathnames } from 'frontend/core/constants';
import Image from 'frontend/core/components/Image';

const NoTOAST = () => {
  return (
    <C.Box fontWeight="bold" color="gray.800" textAlign="center">
      <C.Text fontSize="4xl" mt={0} mb={10}>
        No scheduled TOAST yet.
      </C.Text>
      <Link href={Pathnames.SUBJECTS}>
        <C.Button
          as="a"
          variant="outline"
          cursor="pointer"
          position="relative"
          bg="white"
          size="lg"
          colorScheme="blue"
          pr="70px"
        >
          Propose a subject for the next TOAST
          <Image
            position="absolute"
            transform="translateY(-4px)"
            width={98}
            height={45}
            right="-30px"
            top={0}
            src="https://media.giphy.com/media/3og0IARm07OVhdM8a4/giphy.webp"
          />
        </C.Button>
      </Link>
    </C.Box>
  );
};

export default observer(NoTOAST);
