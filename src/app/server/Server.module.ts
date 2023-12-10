import { Module } from '@nestjs/common';
import { AppSession } from './session/AppSession';

@Module({
  providers: [AppSession],
})
export class ServerModule {}
