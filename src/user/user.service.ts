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

  async updatePlan(userId:number, updateUserDto: UpdateUserDto) {
    const {cost} = updateUserDto
    if(cost === 3000) {
      return await this.userRepository.update({id: userId},{plan: 'BASIC'} )
    }
    if(cost === 5000) {
      return await this.userRepository.update({id: userId}, {plan: 'PRO'})
    }
    else {
      return new BadRequestException('3000원, 5000원만 결제할 수 있습니다.')
    }
  }
}
