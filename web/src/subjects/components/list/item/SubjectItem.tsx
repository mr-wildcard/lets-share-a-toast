import React, {
  FunctionComponent,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react';
import * as C from '@chakra-ui/react';
import dayjs from 'dayjs';
import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { observer } from 'mobx-react-lite';

import { SubjectStatus, Subject, ToastStatus } from '@shared';

import http from '@web/core/httpClient';
import { APIPaths } from '@web/core/constants';
import useStores from '@web/core/hooks/useStores';
import isToast from '@web/core/helpers/isToast';
import NotificationType from '@web/notifications/types/NotificationType';
import Image from '@web/core/components/Image';
import DeleteSubjectModal from '@web/subjects/components/modals/DeleteSubjectModal';
import ViewSubjectModal from '@web/subjects/components/modals/ViewSubjectModal';
import { isSubjectNew } from '@web/subjects/helpers';
import SubjectStatusBadge from './SubjectStatusBadge';
import SubjectSpeakers from './SubjectSpeakers';
import SubjectNewBadge from './SubjectNewBadge';
import css from './SubjectItem.module.css';
import ContextMenuItem from './ContextMenuItem';
import subjectIsInVotingSession from '@web/core/helpers/subjectIsInVotingSession';

interface Props {
  subject: Subject;
  revalidateSubjects(): Promise<boolean>;
  onEditSubject(subject: Subject): void;
}

const SubjectItem: FunctionComponent<Props> = ({
  revalidateSubjects,
  onEditSubject,
  subject,
}) => {
  const {
    currentToastSession: { toast },
  } = useStores();

  const subjectIsInCurrentTOASTVotingSession =
    isToast(toast) && subjectIsInVotingSession(toast.status, subject.status);

  const theme = C.useTheme();
  const viewModal = C.useDisclosure();
  const deleteModal = C.useDisclosure();

  const { auth, notifications } = useStores();

  const [contextualMenuOpened, setContextualMenuOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const changeSubjectStatus = useCallback(
    async (status: SubjectStatus) => {
      setLoading(true);

      try {
        const request = http();

        await request(APIPaths.SUBJECT_STATUS.replace(':id', subject.id), {
          method: 'PUT',
          body: JSON.stringify({
            status,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        await revalidateSubjects();

        // @ts-ignore
        notifications.send(auth.profile, NotificationType.EDIT_SUBJECT_STATUS, {
          subjectTitle: subject.title,
          newStatus: status,
        });
      } catch (error) {
        console.error(
          `An error occured while changing subject ${subject.id} status`,
          { error }
        );
      }

      setLoading(false);
    },
    [subject.id, subject.title, revalidateSubjects, notifications, auth.profile]
  );

  const onCloseDeleteSubjectModal = useCallback(
    async (userConfirmedDeletion: boolean) => {
      deleteModal.onClose();

      if (userConfirmedDeletion) {
        setLoading(true);

        try {
          const request = http();

          await request(APIPaths.SUBJECT.replace(':id', subject.id), {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'DELETE',
          });

          await revalidateSubjects();

          // @ts-ignore
          notifications.send(auth.profile, NotificationType.REMOVE_SUBJECT, {
            subjectTitle: subject.title,
          });
        } catch (error) {
          console.error(
            `An error occured while deleting subject ${subject.id}`,
            { error }
          );
        }

        setLoading(false);
      }
    },
    [
      deleteModal,
      subject.id,
      subject.title,
      revalidateSubjects,
      notifications,
      auth.profile,
    ]
  );

  const contextMenuStatusOptions = useMemo(() => {
    const switchToAvailableStatus = subject.status !== SubjectStatus.AVAILABLE;

    const switchToUnavailbleStatus =
      subject.status !== SubjectStatus.UNAVAILABLE;

    const switchToDoneStatus = subject.status !== SubjectStatus.DONE;

    const statusOptions: ReactElement[] = [];

    if (!switchToAvailableStatus) {
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

    if (!switchToUnavailbleStatus) {
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

    if (!switchToDoneStatus) {
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
  }, [toast, subject, changeSubjectStatus]);

  const { subjectIsOld, oldSubjectImageAlt } = useMemo(() => {
    const creationDate = dayjs(subject.createdDate);

    return {
      subjectIsOld: creationDate.isBefore(dayjs().subtract(3, 'month')),
      oldSubjectImageAlt: `Subject has been submitted ${creationDate.fromNow()}`,
    };
  }, [subject]);

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
              ? theme.colors.gray['50']
              : theme.colors.white,
          }}
        >
          <C.Box
            p={contextualMenuOpened ? '15px' : '20px'}
            borderWidth={contextualMenuOpened ? '5px' : 0}
            borderColor={theme.colors.cyan['400']}
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
                  filter: 'invert(1)',
                }}
              />
            )}

            <C.Box mb={2}>
              <C.Text fontSize="xl" fontWeight="bold">
                {subject.title}
              </C.Text>
            </C.Box>

            <C.Box>
              <SubjectSpeakers speakers={subject.speakers} />
            </C.Box>

            <C.Divider
              mt="30px"
              mb={3}
              borderColor={theme.colors.gray['300']}
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
              bg: theme.colors.gray['100'],
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
              bg: theme.colors.gray['100'],
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
        <ViewSubjectModal subject={subject} closeModal={viewModal.onClose} />
      )}
    </C.Box>
  );
};

export default observer(SubjectItem);
