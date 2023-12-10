import { Module } from '@nestjs/common';
import { UserRepo, AccountRepo } from '.';
import * as usecases from './usecases';

@Module({
  providers: [AccountRepo, UserRepo, ...Object.values(usecases)],
})
export class AccountModule {}
