import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/member/user/user.service';
import { Attendance } from './entities/attendance.entity';
import { Between, Repository } from 'typeorm';
import { Branch } from 'src/branches/entities/branch.entity';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async getTodayAttendanceCount(payload: AuthPayload): Promise<number> {
    return await this.attendanceRepository.count();
  }

  async checkIn(telNumber: string): Promise<void> {
    const user = await this.userService.findByTelNumber(telNumber);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }
    
    const branch = await this.branchRepository.findOne({where: {id: user.branchId}});
    if (!branch) {
      throw new NotFoundException('존재하지 않는 지점');
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();


    const res = await this.attendanceRepository.findOne({
      where: {
        user: {id: user.id},
        createAt: Between(new Date(year, month, day, 0, 0, 0), new Date(year, month, day, 23, 59, 59))
      },
      relations: ['user']
    })
    
    if (res) {
      throw new ConflictException('이미 출석처리 된 회원입니다');
    }

    await this.attendanceRepository.save({
      user,
      branch
    });
  }
}
