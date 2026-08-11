import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  SalesChallan,
  ChallanStatus,
} from '../entities/sales-challan.entity';
import { ChallanItem } from '../entities/challan-item.entity';
import { Customer } from '../entities/customer.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';

import { CreateSalesChallanDto } from './dto/create-sales-challan.dto';

@Injectable()
export class SalesChallanService {
  constructor(
    @InjectRepository(SalesChallan)
    private readonly salesChallanRepository: Repository<SalesChallan>,

    @InjectRepository(ChallanItem)
    private readonly challanItemRepository: Repository<ChallanItem>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(challanData: CreateSalesChallanDto) {
    const customer = await this.customerRepository.findOne({
      where: {
        id: challanData.customerId,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const createdBy = await this.userRepository.findOne({
      where: {
        id: challanData.createdBy,
      },
    });

    if (!createdBy) {
      throw new NotFoundException('User not found');
    }

    if (!challanData.items || challanData.items.length === 0) {
      throw new BadRequestException(
        'At least one product is required',
      );
    }

    const items: ChallanItem[] = [];
    let totalQuantity = 0;

    for (const itemData of challanData.items) {
      const product = await this.productRepository.findOne({
        where: {
          id: itemData.productId,
        },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${itemData.productId} not found`,
        );
      }

      if (
        challanData.status === ChallanStatus.CONFIRMED &&
        product.currentStock < itemData.quantity
      ) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}`,
        );
      }

      const item = this.challanItemRepository.create({
        product,
        productNameSnapshot: product.name,
        skuSnapshot: product.sku,
        unitPriceSnapshot: product.unitPrice,
        quantity: itemData.quantity,
      });

      items.push(item);

      totalQuantity += itemData.quantity;
    }

    const challanNumber = await this.generateChallanNumber();

    const challan = this.salesChallanRepository.create({
      challanNumber,
      customer,
      totalQuantity,
      status: challanData.status ?? ChallanStatus.DRAFT,
      createdBy,
      items,
    });

    if (challan.status === ChallanStatus.CONFIRMED) {
      for (const itemData of challanData.items) {
        const product = await this.productRepository.findOne({
          where: {
            id: itemData.productId,
          },
        });

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${itemData.productId} not found`,
          );
        }

        product.currentStock -= itemData.quantity;

        await this.productRepository.save(product);
      }
    }

    return this.salesChallanRepository.save(challan);
  }

  async findAll() {
    return this.salesChallanRepository.find({
      relations: {
        customer: true,
        createdBy: true,
        items: {
          product: true,
        },
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const challan = await this.salesChallanRepository.findOne({
      where: {
        id,
      },
      relations: {
        customer: true,
        createdBy: true,
        items: {
          product: true,
        },
      },
    });

    if (!challan) {
      throw new NotFoundException('Sales challan not found');
    }

    return challan;
  }

  private async generateChallanNumber(): Promise<string> {
    const count = await this.salesChallanRepository.count();

    const nextNumber = count + 1;

    return `SC-${String(nextNumber).padStart(5, '0')}`;
  }
}