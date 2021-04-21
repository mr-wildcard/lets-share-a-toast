import { User } from '@shared';

export default function getUserFullname(user: User) {
  return `${user.firstName} ${user.lastName}`;
}
