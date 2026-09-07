import { Module } from '@nestjs/common';
import { ImoveisService } from './imoveis.service';
import { ImoveisController } from './imoveis.controller';

@Module({
  providers: [ImoveisService],
  controllers: [ImoveisController]
})
export class ImoveisModule {}
