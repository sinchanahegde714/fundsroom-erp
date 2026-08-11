import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin', 'Sales')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}


  @Post()
  async create(@Body() productData: CreateProductDto) {
    return this.productService.create(productData);
  }


  @Get()
  async findAll() {
    return this.productService.findAll();
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(Number(id));
  }


  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() productData: UpdateProductDto,
  ) {
    return this.productService.update(Number(id), productData);
  }
}