import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { OcnModule } from '../ocn/ocn.module';
import { SessionDbService } from './session-db.service';
@Module({
    imports: [OcnModule],
    controllers: [SessionController],
    providers: [SessionService, SessionDbService]
})
export class SessionModule { }