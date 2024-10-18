import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class SignInDTO {
    @ApiProperty({
    type: String,
    description: '이메일',
    example: 'test@email.com',
    })
    @IsString({ message: '이메일은 문자여야 합니다.' })
    @Matches(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, { message: '이메일 형식이 유효하지 않습니다. {예: test@email.com}'})
    email: string;

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
}