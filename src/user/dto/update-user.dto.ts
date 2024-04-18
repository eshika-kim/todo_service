import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PickType(User, ['plan']) {
  @IsNotEmpty({ message: '비용 값은 필수입니다.' })
  @IsNumber({}, { message: '숫자로만 입력해주세요.' })
  cost: number;
}
