import { SubjectStatus, ToastStatus } from "@shared/enums";

import subjectIsInVotingSession from "../subjectIsInVotingSession";

describe("subjectIsInVotingSession", () => {
  test("should return true", () => {
    expect(
      subjectIsInVotingSession(
        ToastStatus.OPEN_FOR_VOTE,
        SubjectStatus.AVAILABLE
      )
    ).toBe(true);
  });
});
