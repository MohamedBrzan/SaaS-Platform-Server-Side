import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from '../../core/domain/services/user.service';
import { User } from '../../core/domain/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: { name: string; email: string }): Promise<User> {
    return this.userService.createUser(body.name, body.email);
  }

  @Get()
  async sample(): Promise<User> {
    return this.userService.createUser('John Doe', 'john@example.com');
  }
}
