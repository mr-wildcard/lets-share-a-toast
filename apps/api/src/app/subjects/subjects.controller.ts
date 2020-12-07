import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  ParseIntPipe,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { UpdateSubjectStatusDto } from 'api/subjects/dto/update-subject-status.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(@Body() input: CreateSubjectDto) {
    return this.subjectsService.create(input);
  }

  @Get(':id')
  async find(@Param('id', ParseUUIDPipe) id: string) {
    const subject = await this.subjectsService.findOne(id);

    if (!subject) {
      throw new NotFoundException("Subject doesn't exist.");
    }

    return this.subjectsService.findOne(id);
  }

  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateSubjectStatusDto
  ) {
    const subject = await this.find(id);

    return this.subjectsService.updateStatus(subject, input);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateSubjectDto
  ) {
    const subject = await this.find(id);

    return this.subjectsService.update(subject, input);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectsService.remove(id);
  }
}
