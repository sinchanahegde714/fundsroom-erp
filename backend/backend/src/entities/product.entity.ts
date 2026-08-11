import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;


  @Column()
  name!: string;


  @Column({ unique: true })
  sku!: string;


  @Column()
  category!: string;


  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice!: number;


  @Column({ type: 'integer', default: 0 })
  currentStock!: number;


  @Column({ type: 'integer', default: 0 })
  minimumStockAlertQuantity!: number;


  @Column()
  location!: string;


  @CreateDateColumn()
  createdAt!: Date;
}