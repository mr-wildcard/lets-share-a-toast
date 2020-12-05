import { PartialType } from '@nestjs/mapped-types';
import { CreateToastDto } from './create-toast.dto';

export class UpdateToastDto extends PartialType(CreateToastDto) {}
