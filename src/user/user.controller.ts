import {
  Controller,
  Get,
  Request,
  UseGuards,
  HttpStatus,
  Body,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('유저정보')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // 테스트용 유저 정보 확인 로직
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

  // 결제하여 회원등급 변경
  @UseGuards(JwtAuthGuard)
  @Patch('/plan')
  async updatePlan(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const userId = req.user.id;
    const data = await this.userService.updatePlan(userId, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: '성공',
      data,
    };
  }
}

