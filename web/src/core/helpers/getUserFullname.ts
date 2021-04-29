import { User } from "@shared/models";

export default function getUserFullname(user: User) {
  return user.displayName || `USER_WITHOUT_DISPLAY_NAME: ${user.id}`;
}
