import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() input: CreateUserDto) {
    return this.usersService.create(input);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getCurrentLoggedInUser() {
    return {
      firstName: 'Julien',
      lastName: 'Viala',
      picture: 'https://media.giphy.com/media/XgGwL8iUwHIOOMNwmH/giphy.webp',
      email: 'julien.viala@gmail.com',
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() input: UpdateUserDto) {
    return this.usersService.update(id, input);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
