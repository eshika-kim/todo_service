import { IsIn, IsInt, IsNumberString, IsOptional, Min } from 'class-validator';

export class FindUserTodosDto {
  @IsOptional()
  sort: string = 'updated_at';

  @IsOptional()
  @IsNumberString()
  @IsIn(['5', '10'])
  size: string = '5';

  @IsOptional()
  @IsNumberString()
  page: string = '1';
}
