import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SalesChallan } from '../entities/sales-challan.entity';
import { ChallanItem } from '../entities/challan-item.entity';
import { Customer } from '../entities/customer.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';

import { SalesChallanController } from './sales-challan.controller';
import { SalesChallanService } from './sales-challan.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesChallan,
      ChallanItem,
      Customer,
      Product,
      User,
    ]),
  ],

  controllers: [SalesChallanController],

  providers: [SalesChallanService],

  exports: [SalesChallanService],
})
export class SalesChallanModule {}