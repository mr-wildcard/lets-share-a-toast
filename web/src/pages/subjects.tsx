import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toJS } from "mobx";
import * as C from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { Subject } from "@shared/models";

import firebase from "@web/core/firebase";
import useStores from "@web/core/hooks/useStores";
import { spacing, pageColors } from "@web/core/constants";
import ColoredBackground from "@web/core/components/ColoredBackground";
import Image from "@web/core/components/Image";
import { StatusFilterValue } from "@web/subjects/types";
import SubjectForm from "@web/subjects/components/SubjectForm";
import SubjectsList from "@web/subjects/components/list/SubjectsList";
import FilterSubjectStatus from "@web/subjects/components/list/filters/FilterSubjectStatus";
import FilterSearch from "@web/subjects/components/list/filters/FilterSearch";

const Subjects = () => {
  const { ui, appLoader } = useStores();

  const subjects = firebase.subjects;
  const users = firebase.users;

  const loading = !subjects.length && !users.length;

  const formDrawerState = C.useDisclosure();

  const [editedSubject, setEditedSubject] = useState<Subject>();
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");

  const filteredSubjects = useMemo<Subject[]>(() => {
    let finalSubjects = toJS(subjects);

    if (statusFilter !== "all") {
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
        setEditedSubject(undefined);
        formDrawerState.onClose();
      }
    },
    [formDrawerState]
  );

  useEffect(() => {
    ui.currentPageBgColor = pageColors.subjects;
    appLoader.pageIsReady = !loading;
  }, [loading]);

  return (
    <C.Box as="main">
      <title>Subjects | Let&apos;s share a TOAST</title>

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
                  isOpen={formDrawerState.isOpen}
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
