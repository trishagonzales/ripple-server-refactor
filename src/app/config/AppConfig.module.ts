import { Global, Module } from '@nestjs/common';
import { AppConfig } from './';

@Global()
@Module({ providers: [AppConfig] })
export class AppConfigModule {}
