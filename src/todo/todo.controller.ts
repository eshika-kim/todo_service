import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() body) {
    const userId = req.user.id;
    const data = await this.todoService.create(body, userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Todo를 생성하였습니다.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findUserTodos(@Request() req) {
    const userId = req.user.id;
    return await this.todoService.findUserTodos(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Request() req, @Param('id') id: number, @Body() body) {
    const userId = req.user.id;
    const data = this.todoService.update(+id, userId, body);
    return {
      statusCode: HttpStatus.OK,
      message: 'Todo를 수정하였습니다.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number) {
    const userId = req.user.id;
    const data = this.todoService.removeTodo(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: `TodoId: ${id} 번을 삭제하였습니다.`,
      data,
    };
  }
}
