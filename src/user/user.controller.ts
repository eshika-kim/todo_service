import {
  Controller,
  Get,
  Request,
  UseGuards,
  HttpStatus,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('유저정보')
@Controller('users')
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

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Request() req) {
    const userId = req.user.id;
    const data = await this.userService.deleteUser(userId);
    return {
      statusCode: HttpStatus.OK,
      message: '유저 삭제 성공',
      data,
    };
  }
}

