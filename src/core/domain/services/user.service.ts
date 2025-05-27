import { Injectable } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async createUser(name: string, email: string): Promise<User> {
    return this.createUserUseCase.execute(name, email);
  }
}
