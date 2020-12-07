import { observer } from 'mobx-react-lite';
import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/react';
import Link from 'next/link';

import { Toast } from '@letsshareatoast/shared';

import Image from 'frontend/core/components/Image';
import { Pathnames } from 'frontend/core/constants';
import WhosInChargeRecap from './WhosInChargeRecap';
import css from './OpenForVotes.module.css';

interface Props {
  toast: Toast;
}

const OpenForVotes: FunctionComponent<Props> = observer(({ toast }) => {
  return (
    <C.Box fontWeight="bold" color="gray.800" textAlign="center">
      <C.Text fontSize="4xl" mt={0} mb={5}>
        Votes are opened for the upcoming TOAST !
      </C.Text>

      <C.Box mb={10}>
        <WhosInChargeRecap toast={toast} />
      </C.Box>

      <C.Box d="inline-block" position="relative">
        <Link href={Pathnames.VOTING_SESSION}>
          <C.Button
            as="a"
            className={css.link}
            position="relative"
            color="orange.500"
            cursor="pointer"
            variant="outline"
            borderColor="orange.500"
            bg="white"
            size="lg"
            px={4}
          >
            <C.Text pl={60}>Join voting toast !</C.Text>
          </C.Button>
        </Link>
        <Image
          position="absolute"
          left="-10px"
          top="-10px"
          width={80}
          height={80}
          src="https://media.giphy.com/media/B1eGdIUyOhfPi/giphy.webp"
          pointerEvents="none"
        />
      </C.Box>
    </C.Box>
  );
});

export default OpenForVotes;
