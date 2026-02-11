import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './modules/app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { join } from 'path';

import dotenv from 'dotenv';
dotenv.config();

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.useStaticAssets(join(__dirname, '../public'));
  app.setBaseViewsDir(join(__dirname, '../src/views'));
  app.setViewEngine('hbs');
  await app.listen(process.env.SERVER_PORT ?? 3000);

  // Hot reloading
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
