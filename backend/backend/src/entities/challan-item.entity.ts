import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Product } from './product.entity';
import { SalesChallan } from './sales-challan.entity';

@Entity('challan_items')
export class ChallanItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => SalesChallan, (challan) => challan.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  challan!: SalesChallan;

  @ManyToOne(() => Product, { nullable: false })
  product!: Product;

  @Column()
  productNameSnapshot!: string;

  @Column()
  skuSnapshot!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPriceSnapshot!: number;

  @Column({ type: 'integer' })
  quantity!: number;
}