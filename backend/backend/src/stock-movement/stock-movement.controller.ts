import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { StockMovementService } from './stock-movement.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('stock-movements')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin', 'Sales')
export class StockMovementController {
  constructor(
    private readonly stockMovementService: StockMovementService,
  ) {}


  @Post()
  async create(@Body() stockMovementData: CreateStockMovementDto) {
    return this.stockMovementService.create(stockMovementData);
  }


  @Get()
  async findAll() {
    return this.stockMovementService.findAll();
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.stockMovementService.findOne(Number(id));
  }
}