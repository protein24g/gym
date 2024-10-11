import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { TokenService } from './services/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RoleController } from './roles/controllers/role.controller';
import { RoleService } from './roles/services/role.service';
import { KakaoStrategy } from './strategies/kakao-strategy';
import { kakaoAuthController } from './controllers/kakao-auth.controller';
import { kakaoAuthService } from './services/kakao-auth.service';
import { HttpModule } from '@nestjs/axios';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => HttpModule),
    forwardRef(() => FileModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async(configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRE_IN'),
        },
      }),
    })
  ],
  controllers: [AuthController, kakaoAuthController, RoleController],
  providers: [AuthService, kakaoAuthService, RoleService, TokenService, JwtStrategy, JwtRefreshStrategy, KakaoStrategy],
  exports: [AuthService, RoleService],
})
export class AuthModule {}
