import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
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
  @Post('/plan')
  async updatePlan(@Body() updateUserDto:UpdateUserDto, @Request() req ) {
    const userId = req.user.id;
    const data = await this.userService.updatePlan(userId, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: '성공',
      data,
    };
  }
}

