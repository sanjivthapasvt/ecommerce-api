import { User } from '@/features/user/models/user.model';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('note')
export class Note {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.notes, {onDelete: 'CASCADE'})
  @JoinColumn({name: "userId"})
  user!: User

  @Column("varchar")
  @Index()
  title!: string;

  @Column("text")
  content!: string;

  @Column({ default: false })
  @Index()
  isPrivate!: boolean;

  @CreateDateColumn()
  @Index()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 