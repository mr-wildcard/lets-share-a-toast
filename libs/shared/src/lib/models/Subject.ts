import { SubjectStatus } from '../enums/SubjectStatus';
import { SubjectLanguage } from '../enums/SubjectLanguage';
import { User } from './User';

export interface Subject {
  id: string;
  title: string;
  description: string;
  speakers: User[];
  status: SubjectStatus;
  duration: number;
  language?: SubjectLanguage;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  cover: string | null;
  comment: string | null;
}
