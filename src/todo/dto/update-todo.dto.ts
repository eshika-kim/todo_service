import { PartialType } from "@nestjs/mapped-types";
import { CreateTodoDto } from './create-todo.dto';

// CreateTodoDto 그대로 상속
export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
