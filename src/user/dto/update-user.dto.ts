import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserDto {
    
    @IsNotEmpty({message: '비용 값은 필수입니다.'})
    @IsNumber({},{message: '숫자로만 입력해주세요.'})
    cost: number;
}
