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

    // 0은 진행 중, 1은 완료
    // boolean type이 아닌 tinyint를 사용한 이유는
    // 다른 값 가능성을 고려(예를들어 2는 취소, 3은 보류)
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
