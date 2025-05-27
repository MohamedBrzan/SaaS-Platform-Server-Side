import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(name: string, email: string): Promise<User> {
    const user = new User(Date.now(), name, email);
    return this.userRepository.create(user);
  }
}
