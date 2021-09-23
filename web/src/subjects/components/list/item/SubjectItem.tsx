import { deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, {
  FunctionComponent,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  Badge,
  Box,
  ButtonGroup,
  Divider,
  Flex,
  IconButton,
  Spinner,
  Text,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";
import { observer } from "mobx-react-lite";

import { SubjectStatus } from "@shared/enums";
import { Subject } from "@shared/models";

import { firebaseData } from "@web/core/firebase/data";
import { getFirestoreSubjectDoc } from "@web/core/firebase/helpers";
import Image from "@web/core/components/Image";
import DeleteSubjectModal from "@web/subjects/components/modals/DeleteSubjectModal";
import ViewSubjectModal from "@web/subjects/components/modals/ViewSubjectModal";
import { isSubjectNew } from "@web/subjects/helpers";
import subjectIsInVotingSession from "@web/core/helpers/subjectIsInVotingSession";
import { subjectIsSelectedForNextTOAST } from "@web/core/helpers/subjectIsSelectedForNextTOAST";
import SubjectStatusBadge from "./SubjectStatusBadge";
import SubjectSpeakers from "./SubjectSpeakers";
import SubjectNewBadge from "./SubjectNewBadge";
import css from "./SubjectItem.module.css";
import ContextMenuItem from "./ContextMenuItem";

interface Props {
  subject: Subject;
  onEditSubject(subject: Subject): void;
}

const SubjectItem: FunctionComponent<Props> = ({ onEditSubject, subject }) => {
  const { users, currentToast, connectedUser } = firebaseData;

  const subjectIsInCurrentTOASTVotingSession =
    !!currentToast &&
    subjectIsInVotingSession(currentToast.status, subject.status);

  const subjectHasBeenSelectedForNextTOAST =
    !!currentToast && subjectIsSelectedForNextTOAST(currentToast, subject.id);

  const theme = useTheme();
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
    const switchToAvailableStatus = subject.status !== SubjectStatus.AVAILABLE;

    const switchToUnavailbleStatus =
      subject.status !== SubjectStatus.UNAVAILABLE;

    const switchToDoneStatus = subject.status !== SubjectStatus.DONE;

    const statusOptions: ReactElement[] = [];

    if (switchToAvailableStatus) {
      statusOptions.push(
        <ContextMenuItem
          onClick={() => changeSubjectStatus(SubjectStatus.AVAILABLE)}
          key="item-status-available"
        >
          Mark as&nbsp;
          <Badge variant="solid" colorScheme="green" m="1px 0 0 5px">
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
          <Badge variant="solid" colorScheme="red" m="1px 0 0 5px">
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

  const { subjectIsNew, subjectIsOld, oldSubjectImageAlt } = useMemo(() => {
    const creationDate = dayjs(subject.createdDate);

    return {
      subjectIsNew: isSubjectNew(subject.createdDate),
      subjectIsOld: creationDate.isBefore(dayjs().subtract(3, "month")),
      oldSubjectImageAlt: `Subject has been submitted ${creationDate.fromNow()}`,
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
            backgroundColor: contextualMenuOpened
              ? theme.colors.gray["50"]
              : theme.colors.white,
          }}
        >
          <Box
            p={contextualMenuOpened ? "15px" : "20px"}
            borderWidth={contextualMenuOpened ? "5px" : 0}
            borderColor={theme.colors.cyan["400"]}
            borderStyle="solid"
          >
            {subjectIsOld && (
              <Image
                alt={oldSubjectImageAlt}
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

            <Divider mt="30px" mb={3} borderColor={theme.colors.gray["300"]} />

            <Flex align="center">
              {subjectIsNew && subject.status !== SubjectStatus.DONE && (
                <>
                  <SubjectNewBadge />
                  <Box as="span" px={2}>
                    &bull;
                  </Box>
                </>
              )}

              <SubjectStatusBadge status={subject.status} />

              <Box ml="auto" className={css.actions} opacity={0}>
                <ButtonGroup isAttached variant="outline" size="sm">
                  <IconButton
                    icon={<ViewIcon />}
                    onClick={viewModal.onOpen}
                    mr="-1px"
                    title="View"
                    aria-label="View"
                  />
                  <IconButton
                    icon={<EditIcon />}
                    onClick={() => onEditSubject(subject)}
                    mr="-1px"
                    title="Edit"
                    aria-label="Edit"
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={deleteModal.onOpen}
                    title="Delete"
                    aria-label="Delete"
                  />
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
                h="100%"
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
        as={ContextMenu}
        overflow="hidden"
        id={`subject-${subject.id}`}
        zIndex={9999}
        onShow={() => setContextualMenuOpened(true)}
        onHide={() => setContextualMenuOpened(false)}
      >
        {!subjectIsInCurrentTOASTVotingSession &&
          contextMenuStatusOptions.length > 0 && (
            <>
              {contextMenuStatusOptions}
              <Divider />
            </>
          )}

        <MenuItem onClick={() => onEditSubject(subject)}>
          <Box
            d="flex"
            alignItems="center"
            cursor="pointer"
            _hover={{
              bg: theme.colors.gray["100"],
            }}
            p={2}
            px={3}
          >
            <EditIcon mr={3} />
            <Text fontWeight="bold">Edit</Text>
          </Box>
        </MenuItem>
        <MenuItem onClick={deleteModal.onOpen}>
          <Box
            d="flex"
            alignItems="center"
            cursor="pointer"
            _hover={{
              bg: theme.colors.gray["100"],
            }}
            p={2}
            px={3}
          >
            <DeleteIcon mr={3} />
            <Text fontWeight="bold">Delete</Text>
          </Box>
        </MenuItem>
      </Box>

      {deleteModal.isOpen && (
        <DeleteSubjectModal
          alertAboutVotingSession={subjectIsInCurrentTOASTVotingSession}
          alertAboutSubjectBeingSelectedForNextTOAST={
            subjectHasBeenSelectedForNextTOAST
          }
          subject={subject}
          closeModal={onCloseDeleteSubjectModal}
        />
      )}

      {viewModal.isOpen && (
        <ViewSubjectModal subject={subject} closeModal={viewModal.onClose} />
      )}
    </Box>
  );
};

export default observer(SubjectItem);
