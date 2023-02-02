import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 *
 */
async function bootstrap() {
  // rawBody가 켜져있어야 slack bolt에서 json을 파싱하여 처리할 수 있음
  const app = await NestFactory.create(AppModule, { rawBody: true });
  await app.listen(8000);
}
bootstrap();
