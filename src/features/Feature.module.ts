import { Module } from '@nestjs/common';
import { AccountModule } from './account/Account.module';
import { SharedModule } from './shared/Shared.module';

@Module({ imports: [AccountModule, SharedModule] })
export class FeatureModule {}
