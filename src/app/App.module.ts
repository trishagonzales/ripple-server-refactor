import { Module } from '@nestjs/common';
import { FeatureModule } from '../features/Feature.module';
import { AppConfigModule } from './config';
import { DatabaseModule } from './db';
import { ServerModule } from './server';

@Module({
  imports: [FeatureModule, AppConfigModule, DatabaseModule, ServerModule],
})
export class AppModule {}
