import { observer } from 'mobx-react-lite';
import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/react';
import Link from 'next/link';

import { Toast } from '@letsshareatoast/shared';

import Image from 'frontend/core/components/Image';
import { Pathnames } from 'frontend/core/constants';
import WhosInChargeRecap from './WhosInChargeRecap';

interface Props {
  toast: Toast;
}

const OpenForContributions: FunctionComponent<Props> = ({ toast }) => {
  return (
    <C.Box fontWeight="bold" color="gray.800" textAlign="center">
      <C.Text fontSize="4xl" mt={0} mb={5}>
        A new TOAST has been scheduled
        <br />
        and&nbsp;
        <C.Text as="span" textDecoration="underline">
          we need you!
        </C.Text>
      </C.Text>

      <C.Box mb={10}>
        <WhosInChargeRecap toast={toast} />
      </C.Box>

      <Link href={Pathnames.SUBJECTS}>
        <C.Button
          as="a"
          cursor="pointer"
          variant="outline"
          position="relative"
          bg="white"
          size="lg"
          colorScheme="blue"
        >
          Propose a subject for the upcoming TOAST
          <Image
            position="absolute"
            width={58}
            height={62}
            bottom="-33px"
            src="https://media.giphy.com/media/lMClXMEGuSJLZBqBh9/giphy.gif"
          />
        </C.Button>
      </Link>
    </C.Box>
  );
};

export default observer(OpenForContributions);
