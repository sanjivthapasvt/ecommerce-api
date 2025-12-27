import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Product } from './products.models';
import { User } from '@/features/user/models/user.model';

@Entity('reviews')
@Unique(['users', 'products'])
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, type: 'int' })
  stars: number;

  @Column({ nullable: true, type: 'string' })
  comment: string;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
