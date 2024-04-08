import { Instructor } from 'src/instructor/entities/instructor.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @PrimaryColumn({ unsigned: true })
  userId: number;

  @PrimaryColumn({ unsigned: true })
  instructorId: number;

  @Column()
  dayOfWeek: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.lessons)
  user: User[];

  @ManyToOne(() => Instructor, (instructor) => instructor.lessons)
  instructor: Instructor[];
}
