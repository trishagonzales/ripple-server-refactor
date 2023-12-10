import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/App.module';
import { AppConfig } from '@app/config';

async function main() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(AppConfig);
  await app.listen(config.app.port);
}

main();
