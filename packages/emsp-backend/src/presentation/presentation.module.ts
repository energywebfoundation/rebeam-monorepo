import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PresentationController } from './presentation.controller';
import { PresentationService } from './presentation.service';
@Module({
  controllers: [PresentationController],
  providers: [PresentationService],
})
export class PresentationModule {}
