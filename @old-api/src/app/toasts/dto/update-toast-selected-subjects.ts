import { IsString } from 'class-validator';

export class UpdateToastSelectedSubjectsDto {
  @IsString({ each: true })
  selectedSubjectsIds: string[];
}
