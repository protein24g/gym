import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user-create.dto';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))
  async signUp(@Body() userCreateDto: UserCreateDto) {
    return await this.userService.signUp(userCreateDto);
  }
}