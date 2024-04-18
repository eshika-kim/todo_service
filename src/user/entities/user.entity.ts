import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Todo } from 'src/todo/entities/todo.entity';
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

  @Column()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @IsEmail({}, { message: '이메일 형식이 맞지않습니다' })
  email: string;

  @Column()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  @IsString({ message: '숫자+영소문자 조합으로 입력해주세요' })
  password: string;

  @Column()
  @IsNotEmpty({ message: 'plan 기본값은 free입니다.' })
  @IsString({ message: 'FREE, BASIC, PRO 중 하나를 입력해주세요' })
  plan: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => Todo, (todo) => todo.user)
  todos: Todo[];
}
