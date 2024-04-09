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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('레슨')
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

  /**
   * 레슨 id로 조회하기
   * @param id 1
   * @param req 1
   * @returns
   */
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

  /**
   * 레슨 id로 수정하기
   * @param id
   * @param req
   * @param updateLessonDto
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateLesson(
    @Param('id') id: number,
    @Request() req,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    const userId = req.user.id;
    const updatedLesson = await this.lessonService.updateLesson(
      userId,
      id,
      updateLessonDto,
    );

    return {
      statusCode: HttpStatus.OK,
      updatedLesson,
    };
  }

  /**
   * 레슨 id로 삭제하기(논리 삭제)
   * @param id
   * @param req
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async cancelLesson(@Param('id') id: number, @Request() req) {
    const userId = req.user.id;
    await this.lessonService.cancelLesson(userId, id);
    return {
      statusCode: HttpStatus.OK,
    };
  }
}
