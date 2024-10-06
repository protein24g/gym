import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class kakaoAuthService {
  constructor() {}

  async kakaoLogin(code: string) {
    const accessToken = await this.getKakaoAccessToken(code);

    const kakaoUserInfo = await this.getKakaoUserInfo(accessToken);

  }

  async getKakaoAccessToken(code: string) {
    const payload = {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_CLIENT_ID,
      redirect_uri: process.env.KAKAO_REDIRECT_URI,
      code,
    };

    const response = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      payload,
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      });
    return response.data.access_token;
  }

  async getKakaoUserInfo(accessToken: string) {
    const response = await axios.get(
      'https://kapi.kakao.com/v2/user/me',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    return response.data;
  }
}