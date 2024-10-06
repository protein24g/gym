import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user-create.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))
  @ApiOperation({
    summary: '회원가입',
  })
  @ApiResponse({status: 201, description: '회원가입 성공'})
  @ApiResponse({status: 409, description: '이미 가입된 정보'})
  async signUp(@Body() userCreateDto: UserCreateDto) {
    return await this.userService.signUp(userCreateDto);
  }
}