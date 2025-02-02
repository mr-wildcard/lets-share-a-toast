import { deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { FC, ReactElement, useCallback, useMemo, useState } from "react";
import {
  Badge,
  Box,
  ButtonGroup,
  Separator,
  Flex,
  IconButton,
  Spinner,
  Text,
  useDisclosure,
  useToken,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { LuTrash2, LuPencilLine, LuEye } from "react-icons/lu";
import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";
import { observer } from "mobx-react-lite";

import { SubjectStatus } from "@shared/enums";
import { Subject } from "@shared/models";

import { firebaseData } from "@web/core/firebase/data";
import { getFirestoreSubjectDoc } from "@web/core/firebase/helpers";
import Image from "@web/core/components/Image";
import DeleteSubjectModal from "@web/subjects/components/modals/DeleteSubjectModal";
import ViewSubjectModal from "@web/subjects/components/modals/ViewSubjectModal";
import { isSubjectNew, isSubjectPrettyOld } from "@web/subjects/helpers";
import subjectIsInVotingSession from "@web/core/helpers/subjectIsInVotingSession";
import { subjectIsSelectedForNextTOAST } from "@web/core/helpers/subjectIsSelectedForNextTOAST";
import SubjectStatusBadge from "./SubjectStatusBadge";
import SubjectSpeakers from "./SubjectSpeakers";
import SubjectNewBadge from "./SubjectNewBadge";
import ContextMenuItem from "./ContextMenuItem";
import css from "./SubjectItem.module.css";

interface Props {
  subject: Subject;
  onEditSubject(subject: Subject): void;
}

const SubjectItem: FC<Props> = ({ onEditSubject, subject }) => {
  const [gray50] = useToken("colors", ["gray.50"]);

  const { users, currentToast, connectedUser } = firebaseData;

  const subjectIsInCurrentTOASTVotingSession =
    !!currentToast &&
    subjectIsInVotingSession(currentToast.status, subject.status);

  const subjectHasBeenSelectedForNextTOAST =
    !!currentToast && subjectIsSelectedForNextTOAST(subject.status);

  const allowDeletion = !subjectHasBeenSelectedForNextTOAST;

  const viewModal = useDisclosure();
  const deleteModal = useDisclosure();

  const [contextualMenuOpened, setContextualMenuOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const changeSubjectStatus = useCallback(
    async (status: SubjectStatus) => {
      setLoading(true);

      const subjectDoc = getFirestoreSubjectDoc(subject.id);

      await updateDoc(subjectDoc, {
        status,
        lastModifiedDate: serverTimestamp(),
        lastModifiedByUserId: connectedUser?.uid,
      });

      setLoading(false);
    },
    [subject.id, subject.title]
  );

  const onCloseDeleteSubjectModal = useCallback(
    async (userConfirmedDeletion: boolean) => {
      deleteModal.onClose();

      if (userConfirmedDeletion) {
        setLoading(true);

        try {
          const subjectDoc = getFirestoreSubjectDoc(subject.id);

          await deleteDoc(subjectDoc);
        } catch (error) {
          console.error(
            `An error occured while deleting the subject ${subject.id}:`,
            error
          );
        }

        setLoading(false);
      }
    },
    [subject.id]
  );

  const contextMenuStatusOptions = useMemo(() => {
    const switchToAvailableStatus =
      !subjectHasBeenSelectedForNextTOAST &&
      subject.status !== SubjectStatus.AVAILABLE;

    const switchToUnavailbleStatus =
      !subjectHasBeenSelectedForNextTOAST &&
      subject.status !== SubjectStatus.UNAVAILABLE;

    const switchToDoneStatus =
      !subjectHasBeenSelectedForNextTOAST &&
      subject.status !== SubjectStatus.DONE;

    const statusOptions: ReactElement[] = [];

    if (switchToAvailableStatus) {
      statusOptions.push(
        <ContextMenuItem
          onClick={() => changeSubjectStatus(SubjectStatus.AVAILABLE)}
          key="item-status-available"
        >
          Mark as&nbsp;
          <Badge variant="solid" colorPalette="green" m="1px 0 0 5px">
            AVAILABLE
          </Badge>
        </ContextMenuItem>
      );
    }

    if (switchToUnavailbleStatus) {
      statusOptions.push(
        <ContextMenuItem
          onClick={() => changeSubjectStatus(SubjectStatus.UNAVAILABLE)}
          key="item-status-unavailable"
        >
          Mark as&nbsp;
          <Badge variant="solid" colorPalette="red" m="1px 0 0 5px">
            UNAVAILABLE
          </Badge>
        </ContextMenuItem>
      );
    }

    if (switchToDoneStatus) {
      statusOptions.push(
        <ContextMenuItem
          onClick={() => changeSubjectStatus(SubjectStatus.DONE)}
          key="item-status-done"
        >
          Mark as&nbsp;
          <Badge variant="solid" m="1px 0 0 5px">
            ALREADY GIVEN
          </Badge>
        </ContextMenuItem>
      );
    }

    return statusOptions;
  }, [subject.status]);

  const { subjectIsNew, subjectIsPrettyOld } = useMemo(() => {
    return {
      subjectIsNew: isSubjectNew(subject.createdDate),
      subjectIsPrettyOld: isSubjectPrettyOld(subject.createdDate),
    };
  }, [subject.createdDate.getTime()]);

  return (
    <Box className="list-item">
      <ContextMenuTrigger id={`subject-${subject.id}`}>
        <Box
          className={css.subjectItem}
          position="relative"
          boxShadow="sm"
          borderRadius={3}
          transition="transform 200ms ease"
          style={{
            transform: `scale(${contextualMenuOpened ? 0.98 : 1})`,
            backgroundColor: contextualMenuOpened ? gray50 : "white",
          }}
        >
          <Box
            borderColor="cyan.400"
            borderStyle="solid"
            style={{
              padding: contextualMenuOpened ? "15px" : "20px",
              borderWidth: contextualMenuOpened ? "5px" : 0,
            }}
          >
            {subjectIsPrettyOld && (
              <Image
                alt={`Subject has been submitted ${dayjs(
                  subject.createdDate
                ).fromNow()}`}
                src="https://media.giphy.com/media/1BGRBkRdQe995A3JxB/giphy.gif"
                position="absolute"
                width={60}
                height={60}
                top={0}
                right={0}
                style={{
                  filter: "invert(1)",
                }}
              />
            )}

            <Box mb={2}>
              <Text fontSize="xl" fontWeight="bold">
                {subject.title}
              </Text>
            </Box>

            <Box>
              <SubjectSpeakers speakers={subject.speakers} />
            </Box>

            <Separator mt="30px" mb={3} borderColor="gray.300" />

            <Flex align="center">
              <SubjectStatusBadge status={subject.status} />

              {subjectIsNew && subject.status !== SubjectStatus.DONE && (
                <>
                  <Box as="span" px={2}>
                    &bull;
                  </Box>
                  <SubjectNewBadge />
                </>
              )}

              <Box ml="auto" className={css.actions} opacity={0}>
                <ButtonGroup attached variant="outline" size="sm">
                  <IconButton
                    onClick={viewModal.onOpen}
                    mr="-1px"
                    title="View"
                    aria-label="View"
                  >
                    <LuEye />
                  </IconButton>
                  <IconButton
                    onClick={() => onEditSubject(subject)}
                    mr="-1px"
                    title="Edit"
                    aria-label="Edit"
                  >
                    <LuPencilLine />
                  </IconButton>

                  {allowDeletion && (
                    <IconButton
                      onClick={deleteModal.onOpen}
                      title="Delete"
                      aria-label="Delete"
                    >
                      <LuTrash2 />
                    </IconButton>
                  )}
                </ButtonGroup>
              </Box>
            </Flex>

            {loading && (
              <Flex
                className={css.loader}
                align="center"
                justify="center"
                position="absolute"
                top={0}
                left={0}
                w="100%"
                height="100%"
                zIndex={1}
              >
                <Spinner />
              </Flex>
            )}
          </Box>
        </Box>
      </ContextMenuTrigger>

      <Box
        borderRadius={4}
        boxShadow="lg"
        bg="white"
        asChild
        overflow="hidden"
        zIndex={9999}
      >
        <ContextMenu
          id={`subject-${subject.id}`}
          onShow={() => setContextualMenuOpened(true)}
          onHide={() => setContextualMenuOpened(false)}
        >
          {!subjectIsInCurrentTOASTVotingSession &&
            contextMenuStatusOptions.length > 0 &&
            contextMenuStatusOptions}

          {contextMenuStatusOptions.length > 0 && <Separator />}

          <MenuItem onClick={() => onEditSubject(subject)}>
            <Box
              display="flex"
              alignItems="center"
              cursor="pointer"
              _hover={{
                bg: "gray.100",
              }}
              padding={2}
              px={3}
            >
              <Box mr={3}>
                <LuPencilLine />
              </Box>
              <Text fontWeight="bold">Edit</Text>
            </Box>
          </MenuItem>

          {allowDeletion && (
            <MenuItem onClick={deleteModal.onOpen}>
              <Flex
                align="center"
                cursor="pointer"
                _hover={{
                  bg: "gray.100",
                }}
                padding={2}
                px={3}
              >
                <Box mr={3}>
                  <LuTrash2 />
                </Box>
                <Text fontWeight="bold">Delete</Text>
              </Flex>
            </MenuItem>
          )}
        </ContextMenu>
      </Box>

      {deleteModal.open && (
        <DeleteSubjectModal
          alertAboutVotingSession={subjectIsInCurrentTOASTVotingSession}
          subject={subject}
          closeModal={onCloseDeleteSubjectModal}
        />
      )}

      {viewModal.open && (
        <ViewSubjectModal subject={subject} closeModal={viewModal.onClose} />
      )}
    </Box>
  );
};

export default observer(SubjectItem);
