import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SignUpDTO {
  @ApiProperty({
    type: String,
    description: '이메일',
    example: 'test@email.com',
  })
  @IsString({ message: '이메일은 문자여야 합니다.' })
  @Matches(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, { message: '이메일 형식이 유효하지 않습니다. {예: test@email.com}'})
  email?: string;

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
    example: '01011111111',
  })
  @IsNotEmpty({ message: '연락처는 필수 입력입니다.' })
  @IsString({ message: '연락처는 문자여야 합니다.' })
  @Matches(/^\d{2,3}\d{3,4}\d{4}$/, { message: '연락처 형식이 유효하지 않습니다. (예: 01012345678)' })
  telNumber: string;

  @ApiProperty({
    required: true,
    type: String,
    description: '생년월일',
    example: '010203',
  })
  @IsString({ message: '생년월일은 문자여야 합니다.' })
  @Matches(/^([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))$/, { message: '생년월일 형식이 유효하지 않습니다. {예: YYMMDD}'})
  birth: string;

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