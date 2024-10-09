import { Module } from '@nestjs/common';
import { FileService } from './services/file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './services/profile-file.service';
import { UserModule } from 'src/user/user.module';
import { File } from './entities/file.entity';
import { ProfileController } from './controllers/profile-file.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      File,
    ]),
    UserModule,
  ],
  controllers: [ProfileController],
  providers: [FileService, ProfileService],
  exports: [FileService, ProfileService],
})
export class FileModule {}
