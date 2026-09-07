import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ImoveisService } from './imoveis.service';

@Controller('imoveis')
export class ImoveisController {
  constructor(private service: ImoveisService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(Number(id));
  }
}
