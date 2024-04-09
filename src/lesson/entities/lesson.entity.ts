import { IsNotEmpty, IsNumber, Matches } from 'class-validator';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  /**
   * 강사 id
   * @example 2
   */
  @PrimaryColumn({ unsigned: true })
  instructorId: number;

  /**
   * 요일
   * @example 1
   */
  @Column()
  dayOfWeek: number;

  /**
   * 시작 시간
   * @example 08:30
   */
  @Column({ type: 'time' })
  startTime: string;

  /**
   * 종료 시간
   * @example 09:30
   */
  @Column({ type: 'time' })
  endTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.lessons)
  user: User[];

  @ManyToOne(() => Instructor, (instructor) => instructor.lessons)
  instructor: Instructor[];
}
