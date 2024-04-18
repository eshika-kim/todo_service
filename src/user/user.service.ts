import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  // 회원 plan 변경하는 service로직
  async updatePlan(userId:number, updateUserDto: UpdateUserDto) {
    const { cost, plan } = updateUserDto;
    if (cost === 3000 && plan === 'BASIC') {
      return await this.userRepository.query(
        'UPDATE user SET plan = ? WHERE id = ?',
        [plan, userId],
      );
    }
    if (cost === 5000 && plan === 'PRO') {
      return await this.userRepository.query(
        'UPDATE user SET plan = ? WHERE id = ?',
        [plan, userId],
      );
    } else { // 이 이외의 값은 모두 에러가 나도록 처리
      throw new BadRequestException(
        '3000원 - BASIC, 5000원 - PRO 만 결제할 수 있습니다.',
      );
    }
  }
}
