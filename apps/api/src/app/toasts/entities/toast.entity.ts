import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SubjectsTotalVotes, ToastStatus } from '@letsshareatoast/shared';

import { User } from 'api/users/entities/user.entity';
import { Subject } from 'api/subjects/entities/subject.entity';

@Entity()
export class Toast {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => User, { nullable: false, eager: true })
  organizer: User;

  @ManyToOne(() => User, { nullable: false, eager: true })
  scribe: User;

  @Column('enum', {
    enum: ToastStatus,
    default: ToastStatus.OPEN_TO_CONTRIBUTION,
  })
  status: ToastStatus;

  @Column({ default: 2 })
  maxSelectableSubjects: number;

  @ManyToMany(() => Subject, { eager: true })
  @JoinTable()
  selectedSubjects: Subject[];

  @Column('simple-json', { default: {} })
  votes: SubjectsTotalVotes;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  lastModifiedDate: Date;
}
