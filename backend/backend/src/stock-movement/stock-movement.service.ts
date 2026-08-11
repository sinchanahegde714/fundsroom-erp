import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  StockMovement,
  StockMovementType,
} from '../entities/stock-movement.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

@Injectable()
export class StockMovementService {
  constructor(
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(stockMovementData: CreateStockMovementDto) {
    const product = await this.productRepository.findOne({
      where: {
        id: stockMovementData.productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const user = await this.userRepository.findOne({
      where: {
        id: stockMovementData.createdBy,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (
      stockMovementData.movementType === StockMovementType.OUT &&
      product.currentStock < stockMovementData.quantityChanged
    ) {
      throw new BadRequestException('Insufficient stock');
    }

    if (stockMovementData.movementType === StockMovementType.IN) {
      product.currentStock += stockMovementData.quantityChanged;
    } else {
      product.currentStock -= stockMovementData.quantityChanged;
    }

    await this.productRepository.save(product);

    const stockMovement = this.stockMovementRepository.create({
      product,
      quantityChanged: stockMovementData.quantityChanged,
      movementType: stockMovementData.movementType,
      reason: stockMovementData.reason,
      createdBy: user,
    });

    return this.stockMovementRepository.save(stockMovement);
  }

  async findAll() {
    return this.stockMovementRepository.find({
      relations: {
        product: true,
        createdBy: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const stockMovement = await this.stockMovementRepository.findOne({
      where: {
        id,
      },
      relations: {
        product: true,
        createdBy: true,
      },
    });

    if (!stockMovement) {
      throw new NotFoundException('Stock movement not found');
    }

    return stockMovement;
  }
}