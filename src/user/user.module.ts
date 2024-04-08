import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Lesson]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
