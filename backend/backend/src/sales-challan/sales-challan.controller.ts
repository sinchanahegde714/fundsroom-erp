import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { SalesChallanService } from './sales-challan.service';
import { CreateSalesChallanDto } from './dto/create-sales-challan.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('sales-challans')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin', 'Sales')
export class SalesChallanController {
  constructor(
    private readonly salesChallanService: SalesChallanService,
  ) {}


  @Post()
  async create(@Body() challanData: CreateSalesChallanDto) {
    return this.salesChallanService.create(challanData);
  }


  @Get()
  async findAll() {
    return this.salesChallanService.findAll();
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.salesChallanService.findOne(Number(id));
  }
}