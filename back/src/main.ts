import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // DTO로 변환
    forbidNonWhitelisted: true, // 비허용 속성 존재 시 에러 발생
    whitelist: true, // DTO에 정의된 필드만 허용
    exceptionFactory: (errors) => new BadRequestException(errors),
  }));

  const config = new DocumentBuilder()
    .setTitle('Gym API')
    .setDescription('Gym API 문서')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
}
bootstrap();