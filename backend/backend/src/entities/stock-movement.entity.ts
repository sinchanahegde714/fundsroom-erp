import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Product } from './product.entity';
import { User } from './user.entity';

export enum StockMovementType {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product, { nullable: false })
  product!: Product;

  @Column({ type: 'integer' })
  quantityChanged!: number;

  @Column({
    type: 'enum',
    enum: StockMovementType,
  })
  movementType!: StockMovementType;

  @Column('text')
  reason!: string;

  @ManyToOne(() => User, { nullable: false })
  createdBy!: User;

  @CreateDateColumn()
  createdAt!: Date;
}