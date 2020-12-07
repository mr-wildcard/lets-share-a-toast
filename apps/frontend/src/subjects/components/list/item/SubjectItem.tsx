import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import * as C from '@chakra-ui/react';
import dayjs from 'dayjs';
import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

import { SubjectStatus, Subject } from '@letsshareatoast/shared';

import http from 'frontend/core/httpClient';
import { APIPaths } from 'frontend/core/constants';
import useStores from 'frontend/core/hooks/useStores';
import NotificationType from 'frontend/notifications/types/NotificationType';
import Image from 'frontend/core/components/Image';
import DeleteSubjectModal from 'frontend/subjects/components/modals/DeleteSubjectModal';
import ViewSubjectModal from 'frontend/subjects/components/modals/ViewSubjectModal';
import { isSubjectNew } from 'frontend/subjects/helpers';
import SubjectStatusBadge from './SubjectStatusBadge';
import SubjectSpeakers from './SubjectSpeakers';
import SubjectNewBadge from './SubjectNewBadge';
import css from './SubjectItem.module.css';

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

        await request(APIPaths.SUBJECT.replace(':id', subject.id), {
          method: 'PUT',
          body: JSON.stringify({
            status,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        await revalidateSubjects();

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
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'DELETE',
          });

          await revalidateSubjects();

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

  const { subjectIsOld, oldSubjectImageAlt } = useMemo(() => {
    const createdDate = dayjs(subject.createdDate);
    const subjectIsOld = createdDate.isBefore(dayjs().subtract(3, 'month'));

    return {
      subjectIsOld,
      oldSubjectImageAlt:
        subjectIsOld && `Subject has been submitted ${createdDate.fromNow()}`,
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
                <C.ButtonGroup isAttached variant="outline">
                  <C.IconButton
                    size="sm"
                    icon={<ViewIcon />}
                    onClick={viewModal.onOpen}
                    title="View"
                    aria-label="View"
                  />
                  <C.IconButton
                    size="sm"
                    icon={<EditIcon />}
                    onClick={() => onEditSubject(subject)}
                    title="Edit"
                    aria-label="Edit"
                  />
                  <C.IconButton
                    size="sm"
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
        // @ts-ignore
        onShow={() => setContextualMenuOpened(true)}
        onHide={() => setContextualMenuOpened(false)}
      >
        {subject.status !== SubjectStatus.AVAILABLE && (
          <MenuItem
            onClick={() => changeSubjectStatus(SubjectStatus.AVAILABLE)}
          >
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
              Mark as&nbsp;
              <C.Badge variant="solid" colorScheme="green" m="1px 0 0 5px">
                AVAILABLE
              </C.Badge>
            </C.Box>
          </MenuItem>
        )}
        {subject.status !== SubjectStatus.NOT_AVAILABLE && (
          <MenuItem
            onClick={() => changeSubjectStatus(SubjectStatus.NOT_AVAILABLE)}
          >
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
              Mark as&nbsp;
              <C.Badge variant="solid" colorScheme="red" m="1px 0 0 5px">
                UNAVAILABLE
              </C.Badge>
            </C.Box>
          </MenuItem>
        )}
        {subject.status !== SubjectStatus.DONE && (
          <MenuItem onClick={() => changeSubjectStatus(SubjectStatus.DONE)}>
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
              Mark as&nbsp;
              <C.Badge variant="solid" m="1px 0 0 5px">
                ALREADY GIVEN
              </C.Badge>
            </C.Box>
          </MenuItem>
        )}

        <C.Divider />

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

export default SubjectItem;
