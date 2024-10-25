import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class AttendanceDTO {
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
}