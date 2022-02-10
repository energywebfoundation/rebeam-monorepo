import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { OcnModule } from './ocn/ocn.module';
import { PresentationModule } from './presentation/presentation.module';
import { ChargeModule } from "./charge/charge.module"
import loadConfig from './config/load';
import envValidationSchema from './config/schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadConfig],
      validationSchema: envValidationSchema(),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), { autoLoadEntities: true }),
    }),
    LoggerModule,
    OcnModule,
    PresentationModule,
    ChargeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
