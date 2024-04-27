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
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // todo 생성
  async create(createTodoDto, userId: number) {
    const { content, flag, priority } = createTodoDto;
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

    // 예외 한 번에 처리 FREE => 3, BASIC => 3,000개, PRO => 5,000개
    if (
      (userPlan.plan === 'FREE' && todoCount.CNT < 3) ||
      (userPlan.plan === 'BASIC' && todoCount.CNT < 3000) ||
      (userPlan.plan === 'PRO' && todoCount.CNT < 5000)
    ) {
      return await this.todoRepository.query(
        'INSERT INTO todo (user_id, content, flag, priority, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [userId, content, flag, priority],
      );
    }

    throw new BadRequestException(
      '현재 등급의 Todo 개수를 모두 생성하였습니다.',
    );
  }

  // 유저가 만든 todo 조회 : INNER JOIN사용
  // 수정한 순으로 내림차순 정렬(최신순)
  async findUserTodos(userId: number, page: number, sort: string) {
    const pageSize = 5;
    const offset = page ? (page - 1) * pageSize : 1;
    const sortType = sort ? sort : 'updated_at';
    return await this.userRepository.query(
      'SELECT t.user_id, u.email, t.id, t.content, t.flag, t.priority, t.created_at, t.updated_at ' +
        'FROM user u ' +
        'INNER JOIN todo t ON u.id = t.user_id ' +
        'WHERE u.id = ? ' +
        'ORDER BY ' +
        sortType +
        ' DESC ' +
        'LIMIT ? OFFSET ?;',
      [userId, pageSize, offset],
    );
  }

  // todoId로 수정하기
  async update(id: number, userId: number, updateTodoDto: UpdateTodoDto) {
    const { content, flag, priority } = updateTodoDto;
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
