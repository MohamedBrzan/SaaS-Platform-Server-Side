import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../../core/domain/interfaces/user.repository.interface';
import { User } from '../../../../core/domain/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: number): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }
}
