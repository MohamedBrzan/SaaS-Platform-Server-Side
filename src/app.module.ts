import { Module } from '@nestjs/common';
import { UserRepository } from './infrastructure/database/mongo/repositories/user.repository';

@Module({
  controllers: [],
  providers: [UserRepository],
})
export class AppModule {}
