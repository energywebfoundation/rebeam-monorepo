import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      skipNullProperties: true,
      skipUndefinedProperties: true,
      enableDebugMessages: true,
    })
  );

  const logger = app.get(LoggerService);

  const api = new DocumentBuilder().setTitle('ReBeam eMSP Backend').build();
  const document = SwaggerModule.createDocument(app, api);
  SwaggerModule.setup('api/spec', app, document);

  logger.log(`OpenAPI UI mapped to /api/spec`, SwaggerModule.name);
  logger.log('OpenAPI spec mapped to /api/spec-json', SwaggerModule.name);

  const config = app.get(ConfigService);
  const port = +config.get('server.port');
  await app.listen(port);
  logger.log(`Listening on port ${port}`, 'NestApplication');
}
bootstrap();
