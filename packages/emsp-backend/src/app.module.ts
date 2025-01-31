import { Module, CacheInterceptor, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { OcnModule } from './ocn/ocn.module';
import { InvoiceModule } from './invoice/invoice.module';
import { LocationModule } from './location/location.module';
import { PresentationModule } from './presentation/presentation.module';
import { ChargeModule } from './charge/charge.module';
import loadConfig from './config/load';
import envValidationSchema from './config/schema';
import { SessionModule } from './session/session.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

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
    ChargeModule,
    LocationModule,
    SessionModule,
    InvoiceModule,
    CacheModule.register({
      ttl: +process.env.TTL_CACHE,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
