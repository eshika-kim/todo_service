import { User } from 'src/user/entities/user.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Entity,
} from 'typeorm';

@Entity()
export class Todo {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({unsigned: true})
    userId: number;

    @Column()
    content: string;

    @Column({ type: 'tinyint' })
    flag: number;

    @Column({ type: 'tinyint' })
    priority: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    @ManyToOne((type) => User, (user) => user.todos, {onDelete: 'CASCADE'})
    user: User;
}
