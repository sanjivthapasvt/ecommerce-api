import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Review } from './review.model';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ default: "unknown" })
  brand!: string;

  @Column({ nullable: false, type: "float" })
  price!: number;

  @OneToMany(()=> Review, review => review.product)
  reviews: Review[]

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

}
