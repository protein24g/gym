import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class OAuthSignUpDTO {
  @ApiProperty({
    required: true,
    type: 'number',
    description: '지점 id',
    example: '1'
  })
  @IsNotEmpty({ message: '지점을 선택하세요' })
  branchId: number;
  
  @ApiProperty({
    type: 'string',
    description: 'OAuth 고유 ID',
    example: '12345678910',
  })
  @IsOptional()
  @IsString({ message: '고유 ID는 문자열이어야 합니다.' })
  oAuthId?: string;

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
    type: 'string',
    description: '이름',
    example: '감동',
  })
  @IsOptional()
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  name?: string;

  @ApiProperty({
    type: 'string',
    description: '프로필 주소',
    example: 'http://k.kakaocdn.net/dn/dy231d/wgu1321guPjm41N67as8/img_640x640.jpg',
  })
  @IsOptional()
  oAuthProfileUrl?: string;

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
  @IsNotEmpty({ message: '생년월일은 필수 입력입니다.' })
  @IsString({ message: '생년월일은 문자여야 합니다.' })
  @Matches(/^([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))$/, { message: '생년월일 형식이 유효하지 않습니다. {예: YYMMDD}'})
  birth: string;
}