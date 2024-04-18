import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
  // todo 생성
  async create(body, userId: number) {
    const { content, flag, priority } = body;
    // user가 생성한 todo 개수 불러오기
    const [todoCount] = await this.todoRepository.query(
      'SELECT COUNT(*) as CNT FROM todo WHERE user_id = ?',
      [userId],
    );
    // user의 plan 등급 조회
    const [userPlan] = await this.userRepository.query(
      'SELECT plan FROM user WHERE id = ?',
      [userId],
    );

    // 예외처리 1. FREE등급일 때 3개까지 생성가능
    if (userPlan.plan === 'FREE' && todoCount.CNT < 3) {
      return await this.todoRepository.query(
        'INSERT INTO todo (user_id, content, flag, priority, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [userId, content, flag, priority],
      );
    }
    // 예외처리 2. BASIC등급일 때 3000개까지 생성가능
    if (userPlan.plan === 'BASIC' && todoCount.CNT < 3000) {
      return await this.todoRepository.query(
        'INSERT INTO todo (user_id, content, flag, priority, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [userId, content, flag, priority],
      );
    }
    // 예외처리 2. PRO등급일 때 5000개까지 생성가능
    if (userPlan.plan === 'PRO' && todoCount.CNT < 5000) {
      return await this.todoRepository.query(
        'INSERT INTO todo (user_id, content, flag, priority, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [userId, content, flag, priority],
      );
    }
    throw new NotFoundException('Todo를 생성할 수 없습니다.');
  }

  // 유저가 만든 todo 조회
  // 수정한 순으로 정렬
  async findUserTodos(userId: number) {
    const myTodos = await this.userRepository.query(
      'SELECT u.email, t.content, t.flag, t.priority, t.created_at, t.updated_at ' +
        'FROM user u ' +
        'INNER JOIN todo t ON u.id = t.user_id ' +
        'WHERE u.id = ? ' +
        'ORDER BY t.updated_at DESC',
      [userId],
    );
    return myTodos;
  }

  // 중요도로 정렬한 뒤 한 번에 볼 개수 5개로 제한
  async findTodosByPriority(userId: number, page: number) {
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    const myTodos = await this.userRepository.query(
      'SELECT u.email, t.content, t.flag, t.priority, t.created_at, t.updated_at ' +
        'FROM user u ' +
        'INNER JOIN todo t ON u.id = t.user_id ' +
        'WHERE u.id = ? ' +
        'ORDER BY t.priority DESC ' +
        'LIMIT ? OFFSET ?;',
      [userId, pageSize, offset],
    );

    return myTodos;
  }

  // todoId로 수정하기
  async update(id: number, userId: number, body) {
    const { content, flag, priority } = body;
    const [findTodo] = await this.todoRepository.query(
      'SELECT * FROM todo WHERE id = ?',
      [id],
    );
    // todoId가 존재하는지 확인
    if (!findTodo) {
      throw new BadRequestException('해당 todo id는 존재하지 않습니다.');
    }
    // 해당 todoId가 동일한 작성자인지 확인
    if (findTodo.user_id !== userId) {
      throw new UnauthorizedException('작성자만 수정 가능합니다.');
    }

    return await this.todoRepository.query(
      'UPDATE todo SET content = ?, flag = ?, priority = ? WHERE id = ?',
      [content, flag, priority, id],
    );
  }

  async removeTodo(id: number, userId: number) {
    const [findTodo] = await this.todoRepository.query(
      'SELECT * FROM todo WHERE id = ?',
      [id],
    );
    // todoId가 존재하는지 확인
    if (!findTodo) {
      throw new BadRequestException('해당 todo id는 존재하지 않습니다.');
    }
    // 해당 todoId가 동일한 작성자인지 확인
    if (findTodo.user_id !== userId) {
      throw new UnauthorizedException('작성자만 수정 가능합니다.');
    }
    return await this.todoRepository.query('DELETE FROM TODO WHERE id = ?', [
      id,
    ]);
  }
}
