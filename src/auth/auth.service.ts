import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './sign-up.dto.ts/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { SignInDto } from './sign-up.dto.ts/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    const { name, phone, password } = signUpDto;

    const existedUser = await this.userRepository.findOneBy({ phone });
    if (existedUser) {
      throw new BadRequestException('이미 회원가입이 되어있습니다.');
    }

    const user = await this.userRepository.save({ name, phone, password });
    return this.signIn(user.id);
  }

  async signIn(userId: number) {
    const payload = { id: userId };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async validateUser({ name, phone, password }: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { phone },
      select: { id: true, password: true },
    });

    if (!user || user.password !== password) {
      return null;
    }

    return { id: user.id }; //jwt token만들어줄 payload
  }
}
