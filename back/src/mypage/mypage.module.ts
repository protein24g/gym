import { forwardRef, Module } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { MypageController } from './mypage.controller';
import { UserModule } from 'src/member/user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule)
  ],
  controllers: [MypageController],
  providers: [MypageService],
  exports: [MypageService],
})
export class MypageModule {}
