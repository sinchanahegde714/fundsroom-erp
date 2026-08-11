import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Customer } from './customer.entity';
import { User } from './user.entity';
import { ChallanItem } from './challan-item.entity';

export enum ChallanStatus {
  DRAFT = 'Draft',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
}

@Entity('sales_challans')
export class SalesChallan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  challanNumber!: string;

  @ManyToOne(() => Customer, { nullable: false })
  customer!: Customer;

  @Column({ type: 'integer', default: 0 })
  totalQuantity!: number;

  @Column({
    type: 'enum',
    enum: ChallanStatus,
    default: ChallanStatus.DRAFT,
  })
  status!: ChallanStatus;

  @ManyToOne(() => User, { nullable: false })
  createdBy!: User;

  @OneToMany(() => ChallanItem, (item) => item.challan, {
    cascade: true,
  })
  items!: ChallanItem[];

  @CreateDateColumn()
  createdAt!: Date;
}