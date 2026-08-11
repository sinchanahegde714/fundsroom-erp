import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ILike,
  Repository,
} from 'typeorm';

import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(customerData: any) {
    const customer = this.customerRepository.create(customerData);

    return this.customerRepository.save(customer);
  }

  async findAll(
    search?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const where = search
      ? [
          { name: ILike(`%${search}%`) },
          { mobile: ILike(`%${search}%`) },
          { email: ILike(`%${search}%`) },
          { businessName: ILike(`%${search}%`) },
        ]
      : undefined;

    const [customers, total] =
      await this.customerRepository.findAndCount({
        where,
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
      });

    return {
      data: customers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const customer = await this.customerRepository.findOne({
      where: {
        id,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(id: number, customerData: any) {
    const customer = await this.customerRepository.findOne({
      where: {
        id,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    await this.customerRepository.update(id, customerData);

    return this.customerRepository.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: number) {
    const customer = await this.customerRepository.findOne({
      where: {
        id,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    await this.customerRepository.remove(customer);

    return {
      message: 'Customer deleted successfully',
    };
  }
}