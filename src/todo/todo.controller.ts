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

  // 수정한 순으로 정렬한 todo 조회하기
  @UseGuards(JwtAuthGuard)
  @Get()
  async findUserTodos(@Request() req) {
    const userId = req.user.id;
    const data = await this.todoService.findUserTodos(userId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  // 중요도로 정렬한 뒤 한 번에 볼 개수 5개로 제한
  // 예시 http://localhost:3000/api/todos/priority/2
  // 2페이지의 5개 보기
  @UseGuards(JwtAuthGuard)
  @Get('/priority/:page')
  async findTodosByPriority(@Request() req, @Param('page') page: string) {
    const userId = req.user.id;
    const data = await this.todoService.findTodosByPriority(userId, +page);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
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
