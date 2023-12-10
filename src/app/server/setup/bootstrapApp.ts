import helmet from 'helmet';
import { INestApplication } from '@nestjs/common';
import { DatabaseService } from '../../db/Database.service';
import { AppSession } from '../session/AppSession';

export default async (app: INestApplication) => {
  app.use(helmet());

  const session = app.get(AppSession);
  app.use(session.init());

  const db = app.get(DatabaseService);
  await db.enableShutdownHooks(app);
};
