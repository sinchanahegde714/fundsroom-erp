import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StockMovement } from '../entities/stock-movement.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';

import { StockMovementController } from './stock-movement.controller';
import { StockMovementService } from './stock-movement.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockMovement,
      Product,
      User,
    ]),
  ],

  controllers: [StockMovementController],

  providers: [StockMovementService],

  exports: [StockMovementService],
})
export class StockMovementModule {}