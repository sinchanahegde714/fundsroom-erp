import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';


export enum CustomerType {
  Retail = 'Retail',
  Wholesale = 'Wholesale',
  Distributor = 'Distributor',
}


export enum CustomerStatus {
  Lead = 'Lead',
  Active = 'Active',
  Inactive = 'Inactive',
}


export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;


  @IsString()
  @IsNotEmpty()
  mobile: string;


  @IsEmail()
  @IsNotEmpty()
  email: string;


  @IsString()
  @IsNotEmpty()
  businessName: string;


  @IsOptional()
  @IsString()
  gstNumber?: string;


  @IsEnum(CustomerType)
  customerType: CustomerType;


  @IsString()
  @IsNotEmpty()
  address: string;


  @IsEnum(CustomerStatus)
  status: CustomerStatus;


  @IsOptional()
  @IsDateString()
  followUpDate?: string;


  @IsOptional()
  @IsString()
  notes?: string;
}