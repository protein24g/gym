import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TrainerModule } from './trainer/trainer.module';

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
    TrainerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
