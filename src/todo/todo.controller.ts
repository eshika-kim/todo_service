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
  Query,
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
    const data: void = await this.todoService.create(createTodoDto, userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Todo를 생성하였습니다.',
      data,
    };
  }

  // todo 조회하기(overloading)
  // default : 수정한 날짜 오름차순
  // http://localhost:3000/api/todos?page=2
  // page : 조회할 페이지(1페이지 = 5개씩) 추가 반환 값 + 전체개수
  // 중요도 순, 완료 여부 순 => 어떤 방식으로 요청을 받아올지??
  @UseGuards(JwtAuthGuard)
  @Get()
  async findUserTodos(
    @Query('sort') sort: string,
    @Query('page') page: number,
    @Request() req,
  ) {
    const userId = req.user.id;
    const data: object = await this.todoService.findUserTodos(
      userId,
      page,
      sort,
    );
    return {
      statusCode: HttpStatus.OK,
      count: Object.keys(data).length,
      data,
    };
  }

  // todoId를 param으로 보내 수정하기
  // useGuards를 이용해 userId가 작성자면 수정가능
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    const userId = req.user.id;
    const data: void = await this.todoService.update(
      +id,
      userId,
      updateTodoDto,
    );
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
  async remove(@Request() req, @Param('id') id: number) {
    const userId = req.user.id;
    const data: void = await this.todoService.removeTodo(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: `TodoId: ${id} 번을 삭제하였습니다.`,
      data,
    };
  }
}
