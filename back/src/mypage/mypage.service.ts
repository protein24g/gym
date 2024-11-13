import { Injectable, NotFoundException } from '@nestjs/common';
import { OAuthType } from 'src/auth/enums/oauth-type.enum';
import { UserService } from 'src/member/user/user.service';
import { MyPageInfo } from './interfaces/mypage-info.interface';
import { SideProfileInfo } from './interfaces/side-profile-info.interface';

@Injectable()
export class MypageService {
  constructor(
    private readonly userService: UserService,
  ) {}

  async getMyProfile(userId: number): Promise<MyPageInfo> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      telNumber: user.telNumber,
      birth: user.birth,
      createAt: user.createdAt,
      role: user.role,
      branchName: (user.branch ? user.branch.name : null),
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

  async getMyProfileImage(userId: number): Promise<ProfileInfo> {
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

  async getSideProfile(userId: number): Promise<SideProfileInfo>{
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    return {
      name: user.name,
      role: user.role,
      branchName: user.branch ? user.branch.name : null,
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
    return
  }
}
