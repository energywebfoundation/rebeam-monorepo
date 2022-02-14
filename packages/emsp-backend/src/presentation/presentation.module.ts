import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PresentationController } from './presentation.controller';
import { PresentationService } from './presentation.service';
@Module({
  imports: [
    CacheModule.register({
      ttl: +process.env.TTL_CACHE,
    }),
  ],
  controllers: [PresentationController],
  providers: [
    PresentationService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class PresentationModule {}
