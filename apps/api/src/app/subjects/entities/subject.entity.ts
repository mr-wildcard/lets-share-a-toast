import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SubjectStatus, SubjectLanguage } from '@letsshareatoast/shared';

import { User } from 'api/users/entities/user.entity';
import { Toast } from 'api/toasts/entities/toast.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('enum', { enum: SubjectStatus })
  status: SubjectStatus;

  @Column('enum', { enum: SubjectLanguage })
  language: SubjectLanguage;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  speakers: User[];

  @Column()
  duration: number;

  @Column({ nullable: true })
  comment: string;

  @Column({ nullable: true })
  cover: string;

  @CreateDateColumn()
  createdDate: Date;

  @CreateDateColumn()
  lastModifiedDate: Date;
}
