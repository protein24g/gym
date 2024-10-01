import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UserCreateDto {
  @IsString({ message: '아이디는 문자열이어야 합니다.'})
  userId: string;

  @IsNotEmpty({ message: '비밀번호는 필수 입력입니다.' })
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  password: string;

  @IsNotEmpty({ message: '이름 필수 입력입니다.' })
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  name: string;

  @IsNotEmpty({ message: '연락처는 입력입니다.' })
  @IsString({ message: '연락처는 숫자여야 합니다.' })
  @Matches(/^\d{2,3}-\d{3,4}-\d{4}$/, { message: '연락처 형식이 유효하지 않습니다. (예: 010-1234-5678)' })
  telNumber: string;

  @IsNotEmpty({ message: '주소는 필수 입력입니다.' })
  @IsString({ message: '주소는 문자열이어야 합니다.' })
  address: string;

  @IsString({ message: '상세 주소는 문자열이어야 합니다.' })
  addressDetail: string;
}