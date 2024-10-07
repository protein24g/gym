import { Injectable, NotFoundException } from "@nestjs/common";
import axios from "axios";
import { KakaoProfile } from "../interfaces/kakao-profile.interface";
import { AuthService } from "./auth.service";
import { AuthUserCreateDto } from "src/auth/dto/auth-user-create.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class kakaoAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly userSerivce: UserService,
  ) {}

  async kakaoLogin(code: string) {
    const accessToken: string = await this.getKakaoAccessToken(code);

    const kakaoUserInfo: KakaoProfile = await this.getKakaoUserInfo(accessToken);

    const payload = await this.signUpWithKakao(kakaoUserInfo);

    const token = await this.authService.signIn(payload);

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    }
  }

  async getKakaoAccessToken(code: string) {
    const payload = {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_CLIENT_ID,
      redirect_uri: process.env.KAKAO_CALLBACK_URL,
      code,
    };

    const response = await axios.post('https://kauth.kakao.com/oauth/token',
      payload,
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }
    );

    return response.data.access_token;
  }

  async getKakaoUserInfo(accessToken: string): Promise<KakaoProfile> {
    const response = await axios.get('https://kapi.kakao.com/v2/user/me',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const kakaoUserInfo = response.data.kakao_account;

    return {
      id: response.data.id,
      profile_image_url: kakaoUserInfo.profile.profile_image_url,
      name: kakaoUserInfo.name,
      phone_number: '0' + kakaoUserInfo.phone_number.split(' ')[1],
      birthyear: kakaoUserInfo.birthyear,
      birthday: kakaoUserInfo.birthday,
      gender: kakaoUserInfo.gender,
    };
  }

  async signUpWithKakao(kakaoUserInfo: KakaoProfile) {
    const authUserCreateDto: AuthUserCreateDto = {
      userId: kakaoUserInfo.id,
      name: kakaoUserInfo.name,
      telNumber: kakaoUserInfo.phone_number,
    }

    try {
      await this.authService.signUp(authUserCreateDto);
    } catch(error) {
      if (error.response.statusCode === 409) { // 이미 가입된 계정이므로 토큰 발급
        const user = await this.userSerivce.findByUserId(kakaoUserInfo.id);
        if (!user) {
          throw new NotFoundException('존재하지 않는 유저');
        }
        
        return {
          userId: user.userId,
          role: user.role,
        }
      }
    }
  }
}