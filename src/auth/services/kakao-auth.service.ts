import { Injectable } from "@nestjs/common";
import axios from "axios";
import { OAuthPayload } from "../interfaces/oauth-payload.interface";

@Injectable()
export class kakaoAuthService {
  constructor() {}

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

  async getKakaoUserInfo(accessToken: string): Promise<OAuthPayload> {
    const response = await axios.get('https://kapi.kakao.com/v2/user/me',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    return {
      oAuthId: response.data.id,
      name: response.data.kakao_account.profile.nickname,
      oAuthProfileUrl: response.data.kakao_account.profile.profile_image_url,
    };
  }
}