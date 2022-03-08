import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcnApiService } from './services/ocn-api.service';
import { OcnDbService } from './services/ocn-db.service';
import { OcnService } from './services/ocn.service';
import { Auth } from './schemas/auth.schema';
import { Session } from './schemas/session.schema';
import { Endpoint } from './schemas/endpoint.schema';
import { OcnController } from './ocn.controller';
import { OcnBridgeProvider } from './providers/ocn-bridge.provider';
import { Providers } from '../types/symbols';
import { ChargeDetailRecord } from './schemas/cdr.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, Endpoint, Session, ChargeDetailRecord]),
  ],
  providers: [OcnApiService, OcnDbService, OcnService, OcnBridgeProvider],
  exports: [
    TypeOrmModule,
    OcnService,
    OcnDbService,
    {
      provide: Providers.OCN_BRIDGE,
      useValue: OcnBridgeProvider,
    },
  ],
  controllers: [OcnController],
})
export class OcnModule {}
