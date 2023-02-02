import {
  Controller, Get, Param, Query
} from '@nestjs/common';
import { TilsService } from './tils.service';

@Controller('tils')
export class TilsController {
  constructor(
    private readonly tilsService: TilsService,
  ) {}

  @Get()
  findAll(@Query('date') date?: 'today' | 'yesterday' | 'this-month') {
    if (date === 'today') {
      return this.tilsService.findAllToday();
    }
    if (date === 'yesterday') {
      return this.tilsService.findAllYesterday();
    }
    if (date === 'this-month') {
      return this.tilsService.findAllThisMonth();
    }
    return this.tilsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.tilsService.findOne({ _id });
  }
}
