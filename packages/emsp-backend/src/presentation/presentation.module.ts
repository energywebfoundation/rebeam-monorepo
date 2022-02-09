import { Module, CacheModule } from '@nestjs/common';
import { PresentationController } from './presentation.controller';

@Module({
  imports: [
    CacheModule.register({
      ttl: 0,
    }),
  ],
  controllers: [PresentationController],
})
export class PresentationModule {}
