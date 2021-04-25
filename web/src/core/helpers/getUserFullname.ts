import { User } from "@shared/models";

export default function getUserFullname(user: User) {
  return `${user.firstName} ${user.lastName}`;
}
