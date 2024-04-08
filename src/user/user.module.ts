import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Lesson])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
