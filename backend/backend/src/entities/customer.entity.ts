import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CustomerType {
  RETAIL = 'Retail',
  WHOLESALE = 'Wholesale',
  DISTRIBUTOR = 'Distributor',
}

export enum CustomerStatus {
  LEAD = 'Lead',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  mobile!: string;

  @Column()
  email!: string;

  @Column()
  businessName!: string;

  @Column({ type: 'varchar', nullable: true })
  gstNumber!: string | null;

  @Column({
    type: 'enum',
    enum: CustomerType,
  })
  customerType!: CustomerType;

  @Column('text')
  address!: string;

  @Column({
    type: 'enum',
    enum: CustomerStatus,
    default: CustomerStatus.LEAD,
  })
  status!: CustomerStatus;

  @Column({ type: 'date', nullable: true })
  followUpDate!: Date | null;

  @Column('text', { nullable: true })
  notes!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}