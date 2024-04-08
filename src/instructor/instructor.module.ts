import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor, Lesson])],
  controllers: [InstructorController],
  providers: [InstructorService],
})
export class InstructorModule {}
