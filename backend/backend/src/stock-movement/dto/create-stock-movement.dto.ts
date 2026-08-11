import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

import { StockMovementType } from '../../entities/stock-movement.entity';


export class CreateStockMovementDto {
  @IsNumber()
  @Min(1)
  productId: number;


  @IsNumber()
  @Min(1)
  quantityChanged: number;


  @IsEnum(StockMovementType)
  movementType: StockMovementType;


  @IsString()
  @IsNotEmpty()
  reason: string;


  @IsNumber()
  @Min(1)
  createdBy: number;
}