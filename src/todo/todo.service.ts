import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(body, userId: number) {
    const { content, flag, priority } = body;
    const [todoCount] = await this.todoRepository.query(
      'SELECT COUNT(*) as CNT FROM todo WHERE user_id = ?',
      [userId],
    );
    const [userPlan] = await this.userRepository.query(
      'SELECT plan FROM user WHERE id = ?',
      [userId],
    );
    if (userPlan.plan === 'FREE' && todoCount.CNT < 3) {
      return await this.todoRepository.query(
        'INSERT INTO todo (user_id, content, flag, priority, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [userId, content, flag, priority],
      );
    }
    if (userPlan.plan === 'BASIC' && todoCount.CNT < 3000) {
      return await this.todoRepository.query(
        'INSERT INTO todo (user_id, content, flag, priority, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [userId, content, flag, priority],
      );
    }
    if (userPlan.plan === 'PRO' && todoCount.CNT < 5000) {
      return await this.todoRepository.query(
        'INSERT INTO todo (user_id, content, flag, priority, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [userId, content, flag, priority],
      );
    }
    throw new NotFoundException('Todo를 생성할 수 없습니다.');
  }

  async findUserTodos(userId: number) {
    const myTodos = await this.userRepository.query(
      'SELECT u.email, t.content, t.flag, t.priority, t.created_at, t.updated_at ' +
        'FROM user u ' +
        'INNER JOIN todo t ON u.id = t.user_id ' +
        'WHERE u.id = ? ' +
        'ORDER BY t.created_at DESC',
      [userId],
    );
    return myTodos;
  }

  async update(id: number, userId: number, body) {
    const { content, flag, priority } = body;
    const [findTodo] = await this.todoRepository.query(
      'SELECT * FROM todo WHERE id = ?',
      [id],
    );
    if (!findTodo) {
      throw new BadRequestException('해당 todo id는 존재하지 않습니다.');
    }
    if (findTodo.user_id !== userId) {
      throw new UnauthorizedException('작성자만 수정 가능합니다.');
    }
    await this.todoRepository.query(
      'UPDATE todo SET content = ?, flag = ?, priority = ? WHERE id = ?',
      [content, flag, priority, id],
    );
    return `This action updates a #${id} todo`;
  }

  async removeTodo(id: number, userId: number) {
    const [findTodo] = await this.todoRepository.query(
      'SELECT * FROM todo WHERE id = ?',
      [id],
    );
    if (!findTodo) {
      throw new BadRequestException('해당 todo id는 존재하지 않습니다.');
    }
    if (findTodo.user_id !== userId) {
      throw new UnauthorizedException('작성자만 수정 가능합니다.');
    }
    return await this.todoRepository.query('DELETE FROM TODO WHERE id = ?', [
      id,
    ]);
  }
}
