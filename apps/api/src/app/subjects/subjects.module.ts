import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'api/users/users.module';
import { ToastsModule } from 'api/toasts/toasts.module';
import { User } from 'api/users/entities/user.entity';
import { FirebaseModule } from 'api/firebase/firebase.module';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { Subject } from './entities/subject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subject, User]),
    UsersModule,
    FirebaseModule,
    forwardRef(() => ToastsModule),
  ],
  exports: [SubjectsService],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
