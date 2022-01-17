import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Flex, useDisclosure } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { Subject } from "@shared/models";

import { firebaseData } from "@web/core/firebase/data";
import { spacing, pageColors } from "@web/core/constants";
import { Page } from "@web/core/components/Page";
import Image from "@web/core/components/Image";
import { ui } from "@web/core/stores/ui";
import { StatusFilterValue } from "./types";
import SubjectForm from "./components/SubjectForm";
import SubjectsList from "./components/SubjectsList";
import FilterSubjectStatus from "./components/filters/FilterSubjectStatus";
import FilterSearch from "./components/filters/FilterSearch";

const Subjects = () => {
  const formDrawerState = useDisclosure();

  const { subjects, users, currentToast } = firebaseData;

  const [editedSubject, setEditedSubject] = useState<Subject>();
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");

  useEffect(() => {
    window.document.title = "Subjects | Let's share a TOAST";

    ui.currentPageBgColor = pageColors.subjects;
  }, []);

  const filteredSubjects = useMemo<Subject[]>(() => {
    let finalSubjects = subjects;

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

  return (
    <Page flex={1}>
      <Flex
        flex={1}
        position="relative"
        direction="column"
        p={`${spacing.stylizedGap}px`}
      >
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

        <Flex
          mt={`${spacing.stylizedGap}px`}
          mb={`${spacing.stylizedGap * 2}px`}
          fontWeight="bold"
          fontSize="xl"
          color="gray.800"
          justify="center"
        >
          Currently searching for&nbsp;
          <FilterSearch onSearchChanged={setSearchFilter} />
          &nbsp;among&nbsp;
          <FilterSubjectStatus onStatusChanged={setStatusFilter} />.
        </Flex>

        <SubjectsList
          subjects={filteredSubjects}
          creatingSubject={formDrawerState.isOpen && !editedSubject}
          onEditSubject={toggleSubjectEditForm}
          onAddSubject={formDrawerState.onOpen}
        />

        {!!users && (
          <SubjectForm
            subject={editedSubject}
            isOpen={formDrawerState.isOpen}
            closeForm={toggleSubjectEditForm}
          />
        )}
      </Flex>
    </Page>
  );
};

export default observer(Subjects);
