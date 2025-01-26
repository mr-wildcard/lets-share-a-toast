import { observer } from "mobx-react-lite";
import React, { FC, useCallback, useEffect } from "react";
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { LuX, LuSettings, LuPencilLine, LuTrash2 } from "react-icons/lu";
import { animated } from "@react-spring/web";

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
import { CurrentToast } from "@shared/models";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@web/components/ui/menu";

const getActionSpacing = (isSuccess: boolean) => (isSuccess ? 2 : "30px");

const padding = `${spacing.stylizedGap * 2}px ${spacing.stylizedGap}px 0 ${
  spacing.stylizedGap
}px`;

interface Props {
  currentToast?: CurrentToast;
}

const TOASTActions: FC<Props> = ({ currentToast }) => {
  const modalsStates = useActionsModalStates();
  const buttonsStates = useActionsButtonStates(currentToast);
  const animations = useActionsAnimations();

  const closeTOASTFormModal = useCallback((toastCreated: boolean) => {
    modalsStates.toast.onClose();

    if (toastCreated) {
      animations.toastCreation.display(true);
    }
  }, []);

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
        fontSize="lg"
        style={{
          textDecoration: animations.background.opened ? "none" : "underline",
          transition: animations.background.opened
            ? "all 450ms cubic-bezier(0.34, 1.56, 0.64, 1)"
            : "all 250ms ease-out",
          transform: animations.background.opened
            ? animations.background.buttonOpenActionsCSSTransforms
            : undefined,
        }}
        onClick={() =>
          animations.background.open(!animations.background.opened)
        }
        leftIcon={animations.background.opened ? <LuX /> : <LuSettings />}
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
        padding={padding}
        position="relative"
        style={{
          // @ts-expect-error I don't know tbh
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
          inset={0}
          style={{
            // @ts-expect-error I don't KNOW
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

                {modalsStates.openVotes.open && (
                  <OpenVotesModal
                    currentToast={currentToast}
                    closeModal={modalsStates.openVotes.onClose}
                  />
                )}

                {modalsStates.closeVotes.open && (
                  <CloseVotesModal
                    currentToast={currentToast}
                    closeModal={modalsStates.closeVotes.onClose}
                  />
                )}

                {modalsStates.deadHeatSubjects.open && (
                  <DeadHeatSubjectsModal
                    currentToast={currentToast}
                    closeModal={modalsStates.deadHeatSubjects.onClose}
                  />
                )}

                {modalsStates.markTOASTAsReady.open && (
                  <MarkTOASTAsReadyModal
                    currentToast={currentToast}
                    closeModal={modalsStates.markTOASTAsReady.onClose}
                  />
                )}

                {modalsStates.endTOAST.open && (
                  <EndTOASTModal
                    currentToast={currentToast}
                    closeModal={modalsStates.endTOAST.onClose}
                  />
                )}

                {modalsStates.cancelTOAST.open && (
                  <CancelTOASTModal
                    closeModal={modalsStates.cancelTOAST.onClose}
                  />
                )}
              </>
            )}

            <TOASTInfosModal
              isOpen={modalsStates.toast.open}
              closeModal={closeTOASTFormModal}
            />
          </Flex>

          {!!currentToast && (
            <MenuRoot>
              <MenuTrigger asChild>
                <Button
                  textDecoration="underline"
                  position="relative"
                  pt={0}
                  fontWeight="bold"
                >
                  More actions
                </Button>
              </MenuTrigger>
              <MenuContent>
                <MenuItem
                  value="edit-toast"
                  onClick={modalsStates.toast.onOpen}
                  fontWeight="bold"
                >
                  <Box mr={3}>
                    <LuPencilLine />
                  </Box>
                  Edit TOAST
                </MenuItem>
                <MenuItem
                  value="cancel-toast"
                  onClick={modalsStates.cancelTOAST.onOpen}
                  fontWeight="bold"
                  color="red.500"
                >
                  <Box mr={3}>
                    <LuTrash2 />
                  </Box>
                  Cancel TOAST
                </MenuItem>
              </MenuContent>
            </MenuRoot>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default observer(TOASTActions);
