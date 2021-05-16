import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'api/users/entities/user.entity';
import { SubjectsModule } from 'api/subjects/subjects.module';
import { FirebaseModule } from 'api/firebase/firebase.module';
import { Subject } from 'api/subjects/entities/subject.entity';
import { ToastsService } from './toasts.service';
import { ToastsController } from './toasts.controller';
import { Toast } from './entities/toast.entity';
import { ToastSubscriber } from './subscribers/toast.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([Toast, User, Subject]),
    HttpModule,
    forwardRef(() => SubjectsModule),
    FirebaseModule,
  ],
  exports: [ToastsService],
  controllers: [ToastsController],
  providers: [ToastsService, ToastSubscriber],
})
export class ToastsModule {}
