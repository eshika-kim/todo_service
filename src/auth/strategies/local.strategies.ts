import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'phone',
      passwordField: 'password',
    });
  }

  async validate(name: string, phone: string, password: string) {
    const user = await this.authService.validateUser({ name, phone, password });

    if (!user) {
      throw new UnauthorizedException('일치하는 인증 정보가 없습니다.');
    }

    return user;
  }
}
