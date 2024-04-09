import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  /**
   * 레슨 가능 일정 정보받기
   * @returns allSchedule [{},{},...,{}]
   */
  @Get()
  async find() {
    const allSchedule = await this.lessonService.getSchedule();
    return {
      statusCode: HttpStatus.OK,
      allSchedule,
    };
  }

  /**
   * 레슨 신청하기
   * @param createLessonDto
   * @param req
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createLessonDto: CreateLessonDto, @Request() req) {
    const userId = req.user.id;
    await this.lessonService.create(userId, createLessonDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '레슨이 예약되었습니다.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getLesson(@Param('id') id: number, @Request() req) {
    const userId = req.user.id;
    const mylesson = await this.lessonService.getMyLesson(userId, id);
    return {
      statusCode: HttpStatus.OK,
      mylesson,
    };
  }
}
