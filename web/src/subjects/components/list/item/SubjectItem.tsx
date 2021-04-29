import React, {
  FunctionComponent,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from "react";
import * as C from "@chakra-ui/react";
import dayjs from "dayjs";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { observer } from "mobx-react-lite";

import { SubjectStatus, ToastStatus } from "@shared/enums";
import { FirestoreCollection } from "@shared/firebase";
import { Subject, User } from "@shared/models";

import firebase from "@web/core/firebase";
import http from "@web/core/httpClient";
import { APIPaths } from "@web/core/constants";
import useStores from "@web/core/hooks/useStores";
import isToast from "@web/core/helpers/isToast";
import NotificationType from "@web/notifications/types/NotificationType";
import Image from "@web/core/components/Image";
import DeleteSubjectModal from "@web/subjects/components/modals/DeleteSubjectModal";
import ViewSubjectModal from "@web/subjects/components/modals/ViewSubjectModal";
import { isSubjectNew } from "@web/subjects/helpers";
import subjectIsInVotingSession from "@web/core/helpers/subjectIsInVotingSession";
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
  const { users, currentToast } = firebase;

  const subjectIsInCurrentTOASTVotingSession =
    currentToast !== null &&
    subjectIsInVotingSession(currentToast.status, subject.status);

  const theme = C.useTheme();
  const viewModal = C.useDisclosure();
  const deleteModal = C.useDisclosure();

  const [contextualMenuOpened, setContextualMenuOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const changeSubjectStatus = useCallback(
    async (status: SubjectStatus) => {
      setLoading(true);

      await firebase.firestore
        .collection(FirestoreCollection.SUBJECTS)
        .doc(subject.id)
        .update({ status });

      /*
      notifications.send(auth.profile, NotificationType.EDIT_SUBJECT_STATUS, {
        subjectTitle: subject.title,
        newStatus: status,
      });
      */

      setLoading(false);
    },
    [subject.id, subject.title]
  );

  const onCloseDeleteSubjectModal = useCallback(
    async (userConfirmedDeletion: boolean) => {
      deleteModal.onClose();

      setLoading(true);

      if (userConfirmedDeletion) {
        await firebase.firestore
          .collection(FirestoreCollection.SUBJECTS)
          .doc(subject.id)
          .delete();
      }

      setLoading(false);
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
          <C.Badge variant="solid" colorScheme="green" m="1px 0 0 5px">
            AVAILABLE
          </C.Badge>
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
          <C.Badge variant="solid" colorScheme="red" m="1px 0 0 5px">
            UNAVAILABLE
          </C.Badge>
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
          <C.Badge variant="solid" m="1px 0 0 5px">
            ALREADY GIVEN
          </C.Badge>
        </ContextMenuItem>
      );
    }

    return statusOptions;
  }, [subject.status]);

  const { subjectIsOld, oldSubjectImageAlt } = useMemo(() => {
    const creationDate = dayjs(subject.createdDate);

    return {
      subjectIsOld: creationDate.isBefore(dayjs().subtract(3, "month")),
      oldSubjectImageAlt: `Subject has been submitted ${creationDate.fromNow()}`,
    };
  }, [subject.createdDate]);

  const speakers = useMemo(() => {
    return subject.speakersIds.map(
      (spearkerId) => firebase.users.find((user) => user.uid === spearkerId)!
    );
  }, [subject.speakersIds]);

  const subjectIsNew = useMemo(() => {
    return isSubjectNew(subject.createdDate);
  }, [subject]);

  return (
    <C.Box className="list-item">
      <ContextMenuTrigger id={`subject-${subject.id}`}>
        <C.Box
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
          <C.Box
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

            <C.Box mb={2}>
              <C.Text fontSize="xl" fontWeight="bold">
                {subject.title}
              </C.Text>
            </C.Box>

            <C.Box>
              <SubjectSpeakers speakers={speakers} />
            </C.Box>

            <C.Divider
              mt="30px"
              mb={3}
              borderColor={theme.colors.gray["300"]}
            />

            <C.Flex align="center">
              {subjectIsNew && subject.status !== SubjectStatus.DONE && (
                <>
                  <SubjectNewBadge />
                  <C.Box as="span" px={2}>
                    &bull;
                  </C.Box>
                </>
              )}

              <SubjectStatusBadge status={subject.status} />

              <C.Box ml="auto" className={css.actions} opacity={0}>
                <C.ButtonGroup isAttached variant="outline" size="sm">
                  <C.IconButton
                    icon={<ViewIcon />}
                    onClick={viewModal.onOpen}
                    mr="-1px"
                    title="View"
                    aria-label="View"
                  />
                  <C.IconButton
                    icon={<EditIcon />}
                    onClick={() => onEditSubject(subject)}
                    mr="-1px"
                    title="Edit"
                    aria-label="Edit"
                  />
                  <C.IconButton
                    icon={<DeleteIcon />}
                    onClick={deleteModal.onOpen}
                    title="Delete"
                    aria-label="Delete"
                  />
                </C.ButtonGroup>
              </C.Box>
            </C.Flex>

            {loading && (
              <C.Flex
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
                <C.Spinner />
              </C.Flex>
            )}
          </C.Box>
        </C.Box>
      </ContextMenuTrigger>

      <C.Box
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
              <C.Divider />
            </>
          )}

        <MenuItem onClick={() => onEditSubject(subject)}>
          <C.Box
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
            <C.Text fontWeight="bold">Edit</C.Text>
          </C.Box>
        </MenuItem>
        <MenuItem onClick={deleteModal.onOpen}>
          <C.Box
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
            <C.Text fontWeight="bold">Delete</C.Text>
          </C.Box>
        </MenuItem>
      </C.Box>

      {deleteModal.isOpen && (
        <DeleteSubjectModal
          alertAboutVotingSession={subjectIsInCurrentTOASTVotingSession}
          subject={subject}
          closeModal={onCloseDeleteSubjectModal}
        />
      )}

      {viewModal.isOpen && (
        <ViewSubjectModal
          subject={subject}
          speakers={speakers}
          closeModal={viewModal.onClose}
        />
      )}
    </C.Box>
  );
};

export default observer(SubjectItem);
