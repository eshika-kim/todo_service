import { PickType } from '@nestjs/mapped-types';
import { Todo } from '../entities/todo.entity';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';


// 잘못된 값 입력했을 때 예외처리
export class CreateTodoDto extends PickType(Todo, [
  'content',
  'flag',
  'priority',
]) {
  @IsNotEmpty({message: 'flag값은 0은 시작 1은 종료입니다.'})
  @IsIn([0, 1], {message: 'flag 값은 0 아니면 1만 가능합니다.'})
  flag:number;

  @IsNotEmpty({message: '내용은 반드시 입력해야 합니다.'})
  @IsString({message: '문자열로만 입력 가능합니다.'})
  content: string;

  @IsNotEmpty({message: '우선순위를 1~5사이로 입력해주세요'})
  @IsIn([1, 2, 3, 4, 5],{message: '우선순위를 1~5사이로 입력해주세요'})
  priority: number;
}
