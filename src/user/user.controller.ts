import {
  Controller,
  Get,
  Request,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('유저정보')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async find(@Request() req) {
    const userId = req.user.id;
    const data = await this.userService.findOne(userId);

    return {
      statusCode: HttpStatus.OK,
      message: '성공',
      data,
    };
  }
}
