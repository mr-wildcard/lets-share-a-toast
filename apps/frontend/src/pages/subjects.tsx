import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as C from '@chakra-ui/core';
import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import useSWR from 'swr';

import { Subject, User } from '@letsshareatoast/shared';

import useStores from 'frontend/core/hooks/useStores';
import { spacing, APIPaths, pageColors } from 'frontend/core/constants';
import ColoredBackground from 'frontend/core/components/ColoredBackground';
import Image from 'frontend/core/components/Image';
import { StatusFilterValue } from 'frontend/subjects/types';
import SubjectForm from 'frontend/subjects/components/SubjectForm';
import SubjectsList from 'frontend/subjects/components/list/SubjectsList';
import FilterSubjectStatus from 'frontend/subjects/components/list/filters/FilterSubjectStatus';
import FilterSearch from 'frontend/subjects/components/list/filters/FilterSearch';

const Subjects = () => {
  const { ui, appLoading } = useStores();

  const { data: subjects, revalidate: revalidateSubjects } = useSWR<Subject[]>(
    APIPaths.SUBJECTS
  );

  const { data: users } = useSWR<User[]>(APIPaths.USERS);

  const loading = !subjects || !users;

  const formDrawerState = C.useDisclosure();

  const [editedSubject, setEditedSubject] = useState<null | Subject>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const filteredSubjects = useMemo<Subject[]>(() => {
    let finalSubjects = subjects || [];

    if (statusFilter !== 'all') {
      finalSubjects = finalSubjects.filter(
        (subject) => subject.status === statusFilter
      );
    }

    if (searchFilter.length > 0) {
      finalSubjects = finalSubjects.filter((subject) =>
        subject.title
          .toLocaleLowerCase()
          .includes(searchFilter.toLocaleLowerCase())
      );
    }

    return finalSubjects;
  }, [subjects, statusFilter, searchFilter]);

  const toggleSubjectEditForm = useCallback(
    (subject?: Subject) => {
      if (subject) {
        setEditedSubject(subject);
        formDrawerState.onOpen();
      } else {
        setEditedSubject(null);
        formDrawerState.onClose();
      }
    },
    [formDrawerState]
  );

  useEffect(() => {
    ui.currentPageBgColor = pageColors.subjects;

    if (!!subjects && !!users) {
      appLoading.pageLoaded = true;
    }
  }, [appLoading, ui, subjects, users]);

  return (
    <C.Box as="main">
      <Head>
        <title>Subjects | Let&apos;s share a TOAST</title>
      </Head>

      <ColoredBackground d="flex">
        <C.Flex flex={1} position="relative" direction="column">
          {loading && (
            <C.Box m="auto">
              <C.Spinner />
            </C.Box>
          )}

          {!loading && (
            <C.Box position="relative">
              {filteredSubjects.length === 0 && (
                <Image
                  src="https://media.giphy.com/media/A5PYmtufdQIjD37IC0/giphy.gif"
                  position="fixed"
                  left="calc(50% - 240px)"
                  bottom={0}
                  width={480}
                  height={466}
                  alt="No subject matching your criteria."
                />
              )}

              <C.Flex
                pt={`${spacing.stylizedGap * 2}px`}
                pb={`${spacing.stylizedGap * 3}px`}
                fontWeight="bold"
                fontSize="xl"
                color="gray.800"
                justify="center"
              >
                Currently searching for&nbsp;
                <FilterSearch onSearchChanged={setSearchFilter} />
                &nbsp;among&nbsp;
                <FilterSubjectStatus onStatusChanged={setStatusFilter} />.
              </C.Flex>

              <C.Box>
                <SubjectsList
                  subjects={filteredSubjects}
                  revalidateSubjects={revalidateSubjects}
                  creatingSubject={
                    formDrawerState.isOpen && editedSubject === null
                  }
                  onEditSubject={toggleSubjectEditForm}
                  onAddSubject={formDrawerState.onOpen}
                />
              </C.Box>

              {!!users && (
                <SubjectForm
                  subject={editedSubject}
                  allUsers={users}
                  isOpen={formDrawerState.isOpen}
                  revalidateSubjects={revalidateSubjects}
                  closeForm={toggleSubjectEditForm}
                />
              )}
            </C.Box>
          )}
        </C.Flex>
      </ColoredBackground>
    </C.Box>
  );
};

export default observer(Subjects);
