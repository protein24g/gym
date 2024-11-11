import { Injectable, NotFoundException } from '@nestjs/common';
import { OAuthType } from 'src/auth/enums/oauth-type.enum';
import { UserService } from 'src/member/user/user.service';

@Injectable()
export class MypageService {
  constructor(
    private readonly userService: UserService,
  ) {}

  async getMyProfile(userId: number): Promise<ProfileInfo> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }


    return {
      name: user.name,
      profileImageUrl: (user.provider === OAuthType.KAKAO ?
        user.oAuthProfileUrl
        :
        (user.profileImage !== null ?
          `http://localhost:3000/uploads/${user.profileImage.fileName}`
          :
          null
        )
      )
    }
  }
}
