import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image,
} from "@chakra-ui/react";
import {
  CloseIcon,
  SettingsIcon,
  EditIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { animated } from "@react-spring/web";

import { firebaseData } from "@web/core/firebase/data";
import { spacing } from "@web/core/constants";
import useActionsModalStates from "./hooks/useActionsModalStates";
import useActionsButtonStates from "./hooks/useActionsButtonStates";
import useActionsAnimations from "./hooks/useActionsAnimations";
import OpenVotesModal from "./modals/OpenVotes";
import TOASTInfosModal from "./modals/TOASTInfos";
import CancelTOASTModal from "./modals/CancelTOAST";
import CloseVotesModal from "./modals/CloseVotes";
import MarkTOASTAsReadyModal from "./modals/MarkTOASTAsReady";
import { DeadHeatSubjectsModal } from "./modals/DeadHeatSubjects";
import EndTOASTModal from "./modals/EndTOAST";
import InitiateTOAST from "./actions/InitiateTOAST";
import OpenVotes from "./actions/OpenVotes";
import CloseVotes from "./actions/CloseVotes";
import MarkTOASTAsReady from "./actions/MarkTOASTAsReady";
import DeadHeatSubjects from "./actions/DeadHeatSubjects";
import EndTOAST from "./actions/EndTOAST";

const getActionSpacing = (isSuccess: boolean) => (isSuccess ? 2 : "30px");

const padding = `${spacing.stylizedGap * 2}px ${spacing.stylizedGap}px 0 ${
  spacing.stylizedGap
}px`;

const TOASTActions = () => {
  const { currentToast, votingSession } = firebaseData;

  const modalsStates = useActionsModalStates();
  const buttonsStates = useActionsButtonStates(currentToast!);
  const animations = useActionsAnimations();

  const closeTOASTFormModal = useCallback((toastCreated: boolean) => {
    modalsStates.toast.onClose();

    if (toastCreated) {
      animations.toastCreation.display(true);
    }
  }, []);

  const [bgClipPath1, bgClipPath2] = animations.background.finalClipPaths;

  const backgroundOpenAnimationFinished =
    animations.background.opened && animations.background.animationFinished;

  useEffect(() => {
    if (buttonsStates.deadHeatSubjects.display) {
      animations.background.open(true);
    }
  }, []);

  return (
    <Box position="relative">
      <Button
        variant="link"
        position="absolute"
        color="black"
        left={`${spacing.stylizedGap}px`}
        bottom={`${spacing.stylizedGap}px`}
        m={0}
        textDecoration={animations.background.opened ? "none" : "underline"}
        fontSize="lg"
        transition={
          animations.background.opened
            ? "all 450ms cubic-bezier(0.34, 1.56, 0.64, 1)"
            : "all 250ms ease-out"
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
        {animations.background.opened && "Close"}
        {!animations.background.opened && (
          <Box position="relative">
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
          </Box>
        )}
      </Button>
      <Box
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
              return backgroundOpenAnimationFinished
                ? "none"
                : `polygon(0% ${path1}%, 100% ${path2}%, 100% 100%, 0% 100%)`;
            }
          ),
        }}
      >
        {animations.toastCreation.animation(
          (style, item) =>
            item && (
              <Image
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

        <Box
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

        <Flex justify="space-between" position="relative">
          <Flex>
            <Box>
              <InitiateTOAST
                onClick={modalsStates.toast.onOpen}
                isSuccess={buttonsStates.initiateTOAST.isSuccess}
              />
            </Box>

            {!!currentToast && (
              <>
                {buttonsStates.openVotes.display && (
                  <Box ml={getActionSpacing(buttonsStates.openVotes.isSuccess)}>
                    <OpenVotes
                      isSuccess={buttonsStates.openVotes.isSuccess}
                      onClick={modalsStates.openVotes.onOpen}
                    />
                  </Box>
                )}

                {buttonsStates.closeVotes.display && (
                  <Box
                    ml={getActionSpacing(buttonsStates.closeVotes.isSuccess)}
                  >
                    <CloseVotes
                      isSuccess={buttonsStates.closeVotes.isSuccess}
                      onClick={modalsStates.closeVotes.onOpen}
                    />
                  </Box>
                )}

                {buttonsStates.deadHeatSubjects.display && (
                  <Box ml="30px">
                    <DeadHeatSubjects
                      onClick={modalsStates.deadHeatSubjects.onOpen}
                    />
                  </Box>
                )}

                {buttonsStates.markTOASTAsReady.display && (
                  <Box ml="30px">
                    <MarkTOASTAsReady
                      onClick={modalsStates.markTOASTAsReady.onOpen}
                    />
                  </Box>
                )}

                {buttonsStates.endTOAST.display && (
                  <Box ml="30px">
                    <EndTOAST
                      currentToast={currentToast}
                      onClick={modalsStates.endTOAST.onOpen}
                    />
                  </Box>
                )}

                {modalsStates.openVotes.isOpen && (
                  <OpenVotesModal
                    currentToast={currentToast}
                    closeModal={modalsStates.openVotes.onClose}
                  />
                )}

                {modalsStates.closeVotes.isOpen && (
                  <CloseVotesModal
                    currentToast={currentToast}
                    closeModal={modalsStates.closeVotes.onClose}
                  />
                )}

                {modalsStates.deadHeatSubjects.isOpen && (
                  <DeadHeatSubjectsModal
                    currentToast={currentToast}
                    closeModal={modalsStates.deadHeatSubjects.onClose}
                  />
                )}

                {modalsStates.markTOASTAsReady.isOpen && (
                  <MarkTOASTAsReadyModal
                    currentToast={currentToast}
                    closeModal={modalsStates.markTOASTAsReady.onClose}
                  />
                )}

                {modalsStates.endTOAST.isOpen && (
                  <EndTOASTModal
                    currentToast={currentToast}
                    closeModal={modalsStates.endTOAST.onClose}
                  />
                )}

                {modalsStates.cancelTOAST.isOpen && (
                  <CancelTOASTModal
                    currentToast={currentToast}
                    closeModal={modalsStates.cancelTOAST.onClose}
                  />
                )}
              </>
            )}

            <TOASTInfosModal
              isOpen={modalsStates.toast.isOpen}
              closeModal={closeTOASTFormModal}
            />
          </Flex>

          {!!currentToast && (
            <Menu>
              <MenuButton
                textDecoration="underline"
                position="relative"
                size="lg"
                pt={0}
                fontWeight="bold"
                variant="link"
              >
                More actions
              </MenuButton>
              <MenuList>
                <MenuItem onClick={modalsStates.toast.onOpen} fontWeight="bold">
                  <EditIcon mr={3} />
                  Edit TOAST
                </MenuItem>
                <MenuItem
                  onClick={modalsStates.cancelTOAST.onOpen}
                  fontWeight="bold"
                  color="red.500"
                >
                  <DeleteIcon mr={3} />
                  Cancel TOAST
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default observer(TOASTActions);
