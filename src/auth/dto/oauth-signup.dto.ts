import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OAuthSignUpDTO {
  @ApiProperty({
    required: true,
    type: String,
    description: 'OAuth 고유 ID',
    example: '12345678910',
  })
  @IsString({ message: '고유 ID는 문자열이어야 합니다.' })
  oAuthId: string;

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
    type: String,
    description: '프로필 주소',
    example: 'http://k.kakaocdn.net/dn/dy231d/wgu1321guPjm41N67as8/img_640x640.jpg',
  })
  oAuthProfileUrl: string;
}