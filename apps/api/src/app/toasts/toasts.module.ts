import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'api/users/entities/user.entity';
import { SubjectsService } from 'api/subjects/subjects.service';
import { ToastsService } from './toasts.service';
import { ToastsController } from './toasts.controller';
import { Toast } from './entities/toast.entity';
import { SubjectsModule } from 'api/subjects/subjects.module';

@Module({
  imports: [TypeOrmModule.forFeature([Toast, User]), SubjectsModule],
  controllers: [ToastsController],
  providers: [ToastsService],
})
export class ToastsModule {}
