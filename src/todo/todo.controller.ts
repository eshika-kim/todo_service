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
  async create(@Request() req, @Body() createTodoDto: CreateTodoDto) {
    const userId = req.user.id;
    const data = await this.todoService.create(createTodoDto, userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Todo를 생성하였습니다.',
      data,
    };
  }

  // 수정한 순(최신순)으로 정렬한 todo 조회하기
  // default
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

  // todoId를 param으로 보내 수정하기
  // useGuards를 이용해 userId가 작성자면 수정가능 
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Request() req, @Param('id') id: number, @Body() updateTodoDto:UpdateTodoDto) {
    const userId = req.user.id;
    const data = this.todoService.update(+id, userId, updateTodoDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Todo를 수정하였습니다.',
      data,
    };
  }

  // todoId를 param으로 보내 삭제하기
  // useGuards를 이용해 userId가 작성자면 삭제가능 
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
