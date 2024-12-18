import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class SignUpDTO {
  @ApiProperty({
    required: true,
    type: 'number',
    description: '지점 id',
    example: '1'
  })
  @IsNotEmpty({ message: '지점을 선택하세요' })
  branchId: number;

  @ApiProperty({
    required: true,
    type: 'string',
    description: '이름',
    example: '감동',
  })
  @IsNotEmpty({ message: '이름은 필수 입력입니다.' })
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  name: string;

  @ApiProperty({
    required: true,
    type: 'string',
    description: '이메일',
    example: 'test@email.com',
  })
  @IsString({ message: '이메일은 문자여야 합니다.' })
  @Matches(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, { message: '이메일 형식이 유효하지 않습니다. {예: test@email.com}'})
  email: string;

  @ApiProperty({
    required: true,
    type: 'string',
    description: '비밀번호',
    example: 'testpw',
    minimum: 6,
    })
  @IsNotEmpty({ message: '비밀번호는 필수 입력입니다.' })
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(6, {message: '비밀번호는 최소 6자 이상이어야 입니다.'})
  password: string;

  @ApiProperty({
    required: true,
    type: 'string',
    description: '연락처',
    example: '01011111111',
  })
  @IsNotEmpty({ message: '연락처는 필수 입력입니다.' })
  @IsString({ message: '연락처는 문자여야 합니다.' })
  @Matches(/^\d{2,3}\d{3,4}\d{4}$/, { message: '연락처 형식이 유효하지 않습니다. (예: 01012345678)' })
  telNumber: string;

  @ApiProperty({
    required: true,
    type: 'string',
    description: '생년월일',
    example: '010203',
  })
  @IsNotEmpty({ message: '생년월일은 필수 입력입니다.'})
  @IsString({ message: '생년월일은 문자여야 합니다.' })
  @Matches(/^([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))$/, { message: '생년월일 형식이 유효하지 않습니다. {예: YYMMDD}'})
  birth: string;
}