import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthUserCreateDto {
  @ApiProperty({
    required: true,
    type: String,
    description: '아이디',
    example: '카카오 계정 고유 ID',
    minimum: 6,
    maximum: 20,
  })
  @IsString({ message: '아이디는 문자열이어야 합니다.'})
  userId: string;

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
  telNumber: string;
}