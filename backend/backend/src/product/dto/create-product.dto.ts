import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';


export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;


  @IsString()
  @IsNotEmpty()
  sku: string;


  @IsString()
  @IsNotEmpty()
  category: string;


  @IsNumber()
  @Min(0)
  unitPrice: number;


  @IsNumber()
  @Min(0)
  currentStock: number;


  @IsNumber()
  @Min(0)
  minimumStockAlertQuantity: number;


  @IsString()
  @IsNotEmpty()
  location: string;
}