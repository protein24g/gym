import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TrainerModule } from './member/trainer/trainer.module';
import { FileModule } from './file/file.module';
import { UserModule } from './member/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      port: +process.env.DATABASE_PORT,
      entities: [__dirname + '/**/*{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    TrainerModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
