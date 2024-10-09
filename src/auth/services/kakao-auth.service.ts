import { Injectable } from "@nestjs/common";
import axios from "axios";
import { KakaoProfile } from "../interfaces/kakao-profile.interface";
import { AuthService } from "./auth.service";
import { AuthUserCreateDto } from "src/auth/dto/auth-user-create.dto";
import { UserService } from "src/user/user.service";
import { AuthPayload } from "../interfaces/auth-payload.interface";

@Injectable()
export class kakaoAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly userSerivce: UserService,
  ) {}

  async kakaoLogin(code: string): Promise<{accessToken: string, refreshToken: string}> {
    const accessToken: string = await this.getKakaoAccessToken(code);

    const kakaoUserInfo: KakaoProfile = await this.getKakaoUserInfo(accessToken);

    const payload = await this.signUpWithKakao(kakaoUserInfo);

    const token = await this.authService.signIn(payload);

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    }
  }

  async getKakaoAccessToken(code: string): Promise<string> {
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

    return {
      id: response.data.id,
    };
  }

  async signUpWithKakao(kakaoUserInfo: KakaoProfile): Promise<AuthPayload> {
    const authUserCreateDto: AuthUserCreateDto = {
      userId: kakaoUserInfo.id,
    };

    try {
      return await this.authService.signUp(authUserCreateDto, null);
    } catch(error) {
      const user = await this.userSerivce.findByUserId(authUserCreateDto.userId);
      
      return {
        userId: user.userId,
        role: user.role,
      }
    }
  }
}