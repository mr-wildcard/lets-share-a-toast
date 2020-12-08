import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { UsersModule } from './users/users.module';
import { SubjectsModule } from './subjects/subjects.module';
import { User } from './users/entities/user.entity';
import { Subject } from './subjects/entities/subject.entity';
import { ToastsModule } from './toasts/toasts.module';
import { Toast } from './toasts/entities/toast.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: process.env.NODE_ENV !== 'production',
      entities: [User, Subject, Toast],
    }),
    UsersModule,
    SubjectsModule,
    ToastsModule,
    HttpModule,
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
