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
import { LocalStrategy } from './strategies/local-strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RoleController } from './roles/controllers/role.controller';
import { RoleService } from './roles/services/role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
    forwardRef(() => UserModule),
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
  controllers: [AuthController, RoleController],
  providers: [AuthService, RoleService, TokenService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
