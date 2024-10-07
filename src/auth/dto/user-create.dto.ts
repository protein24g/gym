import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserCreateDto {
  @ApiProperty({
    required: true,
    type: String,
    description: '아이디',
    example: 'test01',
    minimum: 6,
    maximum: 20,
  })
  @IsString({ message: '아이디는 문자열이어야 합니다.'})
  @MinLength(6, {message: '아이디는 최소 6자 이상이어야 입니다.'})
  @MaxLength(20, {message: '아이디는 최대 20자 이하여야 입니다'})
  userId: string;

  @ApiProperty({
    required: true,
    type: String,
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
    type: String,
    description: '이름',
    example: '감동',
  })
  @IsNotEmpty({ message: '이름 필수 입력입니다.' })
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  name: string;

  @ApiProperty({
    required: true,
    type: String,
    description: '연락처',
    example: '010-1111-1111',
  })
  @IsNotEmpty({ message: '연락처는 필수 입력입니다.' })
  @IsString({ message: '연락처는 숫자여야 합니다.' })
  @Matches(/^\d{2,3}-\d{3,4}-\d{4}$/, { message: '연락처 형식이 유효하지 않습니다. (예: 010-1234-5678)' })
  telNumber: string;

  @ApiProperty({
    required: true,
    type: String,
    description: '주소',
    example: '대구 달서구 야외음악당로 11길',
  })
  @IsNotEmpty({ message: '주소는 필수 입력입니다.' })
  @IsString({ message: '주소는 문자열이어야 합니다.' })
  address: string;

  @ApiProperty({
    type: String,
    description: '상세 주소',
    example: '11층 1101호',
  })
  @IsString({ message: '상세 주소는 문자열이어야 합니다.' })
  addressDetail: string;
}