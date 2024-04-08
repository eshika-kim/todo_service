import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { User } from 'src/user/entities/user.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, User, Instructor])],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
