import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ChallanStatus } from '../../entities/sales-challan.entity';


export class CreateChallanItemDto {
  @IsNumber()
  @Min(1)
  productId: number;


  @IsNumber()
  @Min(1)
  quantity: number;
}


export class CreateSalesChallanDto {
  @IsNumber()
  @Min(1)
  customerId: number;


  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChallanItemDto)
  items: CreateChallanItemDto[];


  @IsOptional()
  @IsEnum(ChallanStatus)
  status?: ChallanStatus;


  @IsNumber()
  @Min(1)
  createdBy: number;
}