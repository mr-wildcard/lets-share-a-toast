import { User } from "@shared/models";

import getUserFullname from "./getUserFullname";

export function getSubjectSpeakersAsText(speakers: User[]) {
  return speakers.map(getUserFullname).join(", ");
}
