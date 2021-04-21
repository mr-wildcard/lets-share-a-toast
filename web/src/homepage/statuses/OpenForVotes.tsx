import { observer } from 'mobx-react-lite';
import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import { Toast } from '@shared';

import Image from '@web/core/components/Image';
import { Pathnames } from '@web/core/constants';
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
        <C.Button
          as={Link}
          to={Pathnames.VOTING_SESSION}
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
          <C.Text pl="60px">Join voting session !</C.Text>
        </C.Button>
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
