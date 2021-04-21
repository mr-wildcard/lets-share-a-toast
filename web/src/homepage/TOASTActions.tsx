import React, { FunctionComponent, useCallback, useEffect } from 'react';
import * as C from '@chakra-ui/react';
import {
  CloseIcon,
  SettingsIcon,
  EditIcon,
  DeleteIcon,
} from '@chakra-ui/icons';
import { animated } from '@react-spring/web';

import { CurrentToast } from '@shared';

import { spacing } from '@web/core/constants';
import isToast from '@web/core/helpers/isToast';
import Image from '@web/core/components/Image';
import useStores from '@web/core/hooks/useStores';
import useActionsModalStates from './hooks/useActionsModalStates';
import useActionsButtonStates from './hooks/useActionsButtonStates';
import useActionsAnimations from './hooks/useActionsAnimations';
import OpenVotesModal from './modals/OpenVotes';
import TOASTInfosModal from './modals/TOASTInfos';
import CancelTOASTModal from './modals/CancelTOAST';
import CloseVotesModal from './modals/CloseVotes';
import MarkTOASTAsReadyModal from './modals/MarkTOASTAsReady';
import { DeadHeatSubjectsModal } from './modals/DeadHeatSubjects';
import EndTOASTModal from './modals/EndTOAST';
import InitiateTOAST from './actions/InitiateTOAST';
import OpenVotes from './actions/OpenVotes';
import CloseVotes from './actions/CloseVotes';
import MarkTOASTAsReady from './actions/MarkTOASTAsReady';
import DeadHeatSubjects from './actions/DeadHeatSubjects';
import EndTOAST from './actions/EndTOAST';

const getActionSpacing = (isSuccess: boolean) => (isSuccess ? 2 : '30px');

const padding = `${spacing.stylizedGap * 2}px ${spacing.stylizedGap}px ${
  spacing.stylizedGap
}px`;

interface Props {
  currentToast: CurrentToast;
}

const TOASTActions: FunctionComponent<Props> = ({ currentToast }) => {
  const modalsStates = useActionsModalStates();
  const buttonsStates = useActionsButtonStates(currentToast);
  const animations = useActionsAnimations();

  const closeTOASTFormModal = useCallback(
    (toastCreated: boolean) => {
      modalsStates.toast.onClose();

      if (toastCreated) {
        animations.toastCreation.display(true);
      }
    },
    [modalsStates.toast, animations.toastCreation]
  );

  const [bgClipPath1, bgClipPath2] = animations.background.finalClipPaths;

  useEffect(() => {
    if (buttonsStates.deadHeatSubjects.display) {
      animations.background.open(true);
    }
  }, []);

  return (
    <C.Box position="relative">
      <C.Button
        variant="link"
        position="absolute"
        color="black"
        left={`${spacing.stylizedGap}px`}
        bottom={`${spacing.stylizedGap}px`}
        m={0}
        textDecoration={animations.background.opened ? 'none' : 'underline'}
        fontSize="lg"
        transition={
          animations.background.opened
            ? 'all 450ms cubic-bezier(0.34, 1.56, 0.64, 1)'
            : 'all 250ms ease-out'
        }
        style={{
          transform: animations.background.opened
            ? animations.background.buttonOpenActionsCSSTransforms
            : undefined,
        }}
        onClick={() =>
          animations.background.open(!animations.background.opened)
        }
        leftIcon={
          animations.background.opened ? <CloseIcon /> : <SettingsIcon />
        }
      >
        {animations.background.opened && 'Close'}
        {!animations.background.opened && (
          <C.Box position="relative">
            Manage TOAST
            {buttonsStates.deadHeatSubjects.display && (
              <Image
                position="absolute"
                bottom="100%"
                width={70}
                height={70}
                src="https://media.giphy.com/media/2yxItMecS1FwrhNitr/giphy.gif"
              />
            )}
          </C.Box>
        )}
      </C.Button>
      <C.Box
        as={animated.div}
        p={padding}
        position="relative"
        style={{
          // @ts-ignore
          clipPath: animations.background.animation.clipPath.to(
            (path1, path2) => {
              /**
               * Disable `clip-path` at the end of the animation
               * to let the menu displays correctly.
               */
              return path1 === bgClipPath1 && path2 === bgClipPath2
                ? 'none'
                : `polygon(0% ${path1}%, 100% ${path2}%, 100% 100%, 0% 100%)`;
            }
          ),
        }}
      >
        {animations.toastCreation.animation(
          (style, item) =>
            item && (
              <C.Image
                as={animated.img}
                src="https://media.giphy.com/media/l0IyaxKjZqenpMIQ8/giphy.webp"
                position="absolute"
                right={0}
                bottom="80%"
                w="auto"
                h="50vh"
                borderBottomRightRadius="3px"
                style={{
                  opacity: `${style.opacity}`,
                }}
              />
            )
        )}

        <C.Box
          as={animated.div}
          position="absolute"
          bg="white"
          top={0}
          right={0}
          bottom={0}
          left={0}
          style={{
            // @ts-ignore
            clipPath: animations.background.animation.clipPath.to(
              (path1, path2) =>
                `polygon(0% ${path1}%, 100% ${path2}%, 100% 100%, 0% 100%)`
            ),
          }}
        />

        <C.Flex justify="space-between" position="relative">
          <C.Flex>
            <C.Box>
              <InitiateTOAST
                onClick={modalsStates.toast.onOpen}
                isSuccess={buttonsStates.initiateTOAST.isSuccess}
              />
            </C.Box>

            {isToast(currentToast) && (
              <>
                <C.Box ml={getActionSpacing(buttonsStates.openVotes.isSuccess)}>
                  <OpenVotes
                    isSuccess={buttonsStates.openVotes.isSuccess}
                    onClick={modalsStates.openVotes.onOpen}
                  />
                </C.Box>

                {buttonsStates.closeVotes.display && (
                  <C.Box
                    ml={getActionSpacing(buttonsStates.closeVotes.isSuccess)}
                  >
                    <CloseVotes
                      isSuccess={buttonsStates.closeVotes.isSuccess}
                      onClick={modalsStates.closeVotes.onOpen}
                    />
                  </C.Box>
                )}

                {buttonsStates.deadHeatSubjects.display && (
                  <C.Box ml="30px">
                    <DeadHeatSubjects
                      onClick={modalsStates.deadHeatSubjects.onOpen}
                    />
                  </C.Box>
                )}

                {buttonsStates.markTOASTAsReady.display && (
                  <C.Box ml="30px">
                    <MarkTOASTAsReady
                      onClick={modalsStates.markTOASTAsReady.onOpen}
                    />
                  </C.Box>
                )}

                {buttonsStates.endTOAST.display && (
                  <C.Box ml="30px">
                    <EndTOAST
                      currentToast={currentToast}
                      onClick={modalsStates.endTOAST.onOpen}
                    />
                  </C.Box>
                )}

                <CancelTOASTModal
                  currentToast={currentToast}
                  isOpen={modalsStates.cancelTOAST.isOpen}
                  closeModal={modalsStates.cancelTOAST.onClose}
                />

                <OpenVotesModal
                  currentToast={currentToast}
                  isOpen={modalsStates.openVotes.isOpen}
                  closeModal={modalsStates.openVotes.onClose}
                />

                <CloseVotesModal
                  currentToast={currentToast}
                  isOpen={modalsStates.closeVotes.isOpen}
                  closeModal={modalsStates.closeVotes.onClose}
                />

                <MarkTOASTAsReadyModal
                  currentToast={currentToast}
                  isOpen={modalsStates.markTOASTAsReady.isOpen}
                  closeModal={modalsStates.markTOASTAsReady.onClose}
                />

                <DeadHeatSubjectsModal
                  currentToast={currentToast}
                  isOpen={modalsStates.deadHeatSubjects.isOpen}
                  closeModal={modalsStates.deadHeatSubjects.onClose}
                />

                <EndTOASTModal
                  currentToast={currentToast}
                  isOpen={modalsStates.endTOAST.isOpen}
                  closeModal={modalsStates.endTOAST.onClose}
                />
              </>
            )}

            <TOASTInfosModal
              currentToast={currentToast}
              isOpen={modalsStates.toast.isOpen}
              closeModal={closeTOASTFormModal}
            />
          </C.Flex>

          {isToast(currentToast) && (
            <C.Menu>
              <C.MenuButton
                textDecoration="underline"
                position="relative"
                size="lg"
                pt={0}
                fontWeight="bold"
                variant="link"
              >
                More actions
              </C.MenuButton>
              <C.MenuList>
                <C.MenuItem
                  onClick={modalsStates.toast.onOpen}
                  fontWeight="bold"
                >
                  <EditIcon mr={3} />
                  Edit TOAST
                </C.MenuItem>
                <C.MenuItem
                  onClick={modalsStates.cancelTOAST.onOpen}
                  fontWeight="bold"
                  color="red.500"
                >
                  <DeleteIcon mr={3} />
                  Cancel TOAST
                </C.MenuItem>
              </C.MenuList>
            </C.Menu>
          )}
        </C.Flex>
      </C.Box>
    </C.Box>
  );
};

export default TOASTActions;
