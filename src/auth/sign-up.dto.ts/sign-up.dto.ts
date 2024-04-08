import { PickType } from '@nestjs/mapped-types';
import { User } from 'src/user/entities/user.entity';

export class SignUpDto extends PickType(User, ['phone', 'password']) {}
