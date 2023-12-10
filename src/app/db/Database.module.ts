import { Global, Module } from '@nestjs/common';
import { AppConfig } from '../config/AppConfig';
import { DatabaseService } from './Database.service';

@Global()
@Module({
  providers: [
    {
      provide: DatabaseService,
      useFactory: (config: AppConfig) =>
        new DatabaseService({
          datasources: { db: { url: config.db.url } },
        }),
      inject: [AppConfig],
    },
  ],
})
export class DatabaseModule {}
