import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerService);
  const config = app.get(ConfigService);
  const port = +config.get('server.port');
  await app.listen(port);
  logger.log(`Listening on port ${port}`, 'NestApplication');
}
bootstrap();
