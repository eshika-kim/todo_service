import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  /**
   * 이름
   * @example "김세령"
   */
  @Column()
  @IsNotEmpty({ message: '성함을 입력해주세요' })
  @IsString({ message: '이름이 형식에 맞지않습니다' })
  name: string;

  /**
   * 핸드폰 번호
   * @example "01012345678"
   */
  @Column({ unique: true })
  @IsNotEmpty({ message: '핸드폰번호를 입력해주세요' })
  @IsString({ message: '핸드폰번호 형식에 맞지않습니다' })
  phone: string;

  /**
   * 비밀번호
   * @example "a1234"
   */
  @Column()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  @IsString({ message: '숫자+영소문자 조합으로 입력해주세요' })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Lesson, (lesson) => lesson.user)
  lessons: Lesson[];
}
