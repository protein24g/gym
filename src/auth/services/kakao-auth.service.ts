import { Injectable } from "@nestjs/common";
import axios from "axios";
import { KakaoProfile } from "../interfaces/kakao-profile.interface";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { AuthPayload } from "../interfaces/auth-payload.interface";
import { OAuthType } from "../enums/oauth-type.enum";
import { TokenPayload } from "../interfaces/token-payload.interface";
import { OAuthSignUpDTO } from "../dto/oauth-signup.dto";

@Injectable()
export class kakaoAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly userSerivce: UserService,
  ) {}

  async kakaoLogin(code: string): Promise<TokenPayload> {
    const kakaoAccessToken: string = await this.getKakaoAccessToken(code);

    const kakaoUserInfo: KakaoProfile = await this.getKakaoUserInfo(kakaoAccessToken);
    // 리다이렉트로 추가 정보 입력 받은 후 프론트에서 post로 최종 가입 요청

    const payload = await this.signUpWithKakao(kakaoUserInfo);

    const token = await this.authService.signIn(payload);

    return {
      accessToken: token.accessToken,
      kakaoAccessToken: kakaoAccessToken,
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
      name: response.data.kakao_account.profile.nickname,
      oAuthProfileUrl: response.data.kakao_account.profile.profile_image_url,
    };
  }

  async signUpWithKakao(kakaoUserInfo: KakaoProfile): Promise<AuthPayload> {
    const oAuthSignupDTO: OAuthSignUpDTO = {
      // 임시로 만든 가짜 데이터(프론트에서 추가 정보 요청 받도록 수정 하기)
      email: 'test',
      name: kakaoUserInfo.name,
      telNumber: '01011111111',
      birth: '010101',
      address: '대구',
      addressDetail: '대구 상세 주소',
      oAuthProfileUrl: kakaoUserInfo.oAuthProfileUrl,
    };

    try {
      return await this.authService.oAuthSignUp(oAuthSignupDTO, OAuthType.KAKAO);
    } catch(error) {
      const user = await this.userSerivce.findByTelNumber('01011112222'); // 임시로 만든 가짜 데이터(프론트에서 추가 정보 요청 받도록 수정 하기)
      
      return {
        userId: user.id,
        role: user.role,
      }
    }
  }

  async logout(kakaoAccessToken: string) {
    const response = await axios.post('https://kapi.kakao.com/v1/user/logout',
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }
    );

    
  }
}