import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'typeorm';

import { UsersModule } from './users/users.module';
import { SubjectsModule } from './subjects/subjects.module';
import { RealTimeModule } from './real-time/real-time.module';
import { User } from './users/entities/user.entity';
import { ToastsModule } from './toasts/toasts.module';
import { Subject } from './subjects/entities/subject.entity';
import { Toast } from './toasts/entities/toast.entity';
import { ToastSubscriber } from './toasts/subscribers/toast.subscriber';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: process.env.NODE_ENV !== 'production',
      entities: [User, Subject, Toast],
      subscribers: [ToastSubscriber],
    }),
    EventEmitterModule.forRoot(),
    UsersModule,
    SubjectsModule,
    ToastsModule,
    RealTimeModule,
    HttpModule,
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
