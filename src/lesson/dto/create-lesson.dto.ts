import { PickType } from '@nestjs/mapped-types';
import { Lesson } from '../entities/lesson.entity';
import { IsInt, IsNotEmpty, Matches } from 'class-validator';

export class CreateLessonDto extends PickType(Lesson, [
  'instructorId',
  'dayOfWeek',
  'startTime',
  'endTime',
]) {
  @IsInt({ message: '숫자만 입력해주세요' })
  @IsNotEmpty({ message: '필수 값 입니다.' })
  instructorId: number;

  @IsNotEmpty({ message: '필수 값 입니다.' })
  @IsInt({ message: '숫자만 입력해주세요. 일요일 ~ 토요일 = 0 ~ 6' })
  //   @Matches(/^[0-6]$/, { message: '0 ~ 6까지의 숫자만 입력 가능합니다.' })
  dayOfWeek: number;

  @Matches(/^([01]?[0-9]|2[0-3]):(00|30)$/, {
    message: '시작 시간은 HH:00 또는 HH:30 형식이어야 합니다.',
  })
  startTime: string;

  @Matches(/^([01]?[0-9]|2[0-3]):(00|30)$/, {
    message: '종료 시간은 HH:00 또는 HH:30 형식이어야 합니다.',
  })
  endTime: string;
}
