import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { Toast } from 'api/toasts/entities/toast.entity';
import { Subject } from 'api/subjects/entities/subject.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  picture: string;
}
