import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/member/user/user.service';
import { Attendance } from './entities/attendance.entity';
import { Between, Repository } from 'typeorm';
import { Branch } from 'src/branches/entities/branch.entity';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async getRecentMonthAttendance(payload: AuthPayload): Promise<Record<string, string | number>[]> {
    // 오늘 날짜 자정
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // 30일 전 날짜 계산
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 29);  // 30일간의 데이터를 포함하려면 -29로 설정
    startDate.setHours(0, 0, 0, 0); // 자정으로 설정

    // 현재 날짜 끝 시간 설정 (23:59:59)
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999); // 23:59:59로 설정

    /*
      USER: 자신의 최근 30일 출석 데이터
      MANAGER, TRAINER: 해당 지점 최근 30일 출석 데이터
      OWNER: 지점별 최근 30일 출석 데이터
    */
    let res: Attendance[];    
    if (payload.role === RoleType.USER) {
      res = await this.attendanceRepository.find({
        where: {
          user: {id: payload.userId},
          createdAt: Between(startDate, endDate),
        },
        relations: ['user'],
        order: { id: 'asc'}
      });
    } else if (payload.role === RoleType.MANAGER || payload.role === RoleType.TRAINER) {
      const user = await this.userService.findById(payload.userId);
      if (!user) {
        throw new NotFoundException('존재하지 않는 유저');
      }
      
      res = await this.attendanceRepository.find({
        where: {
          branch: {id: user.branch.id},
          createdAt: Between(startDate, endDate),
        },
        relations: ['branch'],
        order: { id: 'asc'}
      });
    } else if (payload.role === RoleType.OWNER) {
      res = await this.attendanceRepository.find({
        where: {
          createdAt: Between(startDate, endDate),
        },
        relations: ['branch'],
        order: { id: 'asc'}
      });      
    }

    const dateDict: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateKey = String(date.getFullYear()) + String((date.getMonth() + 1)).padStart(2, '0') + String(date.getDate()).padStart(2, '0');
      dateDict[dateKey] = 0;
    }

    const branchDict: Record<string, Record<string, number>> = {};
    if (payload.role === RoleType.OWNER) {
      res.map((attendance) => {
        const branchName = attendance.branch.name.split(' ')[1]; // (예시 데이터: 1호점, 2호점 ...)
        if (!branchDict[attendance.branch.name.split(' ')[1]]) {
          branchDict[branchName] = {...dateDict};
        }

        branchDict[branchName][String(attendance.createdAt.getFullYear()) + String((attendance.createdAt.getMonth() + 1)).padStart(2, '0') + String(attendance.createdAt.getDate()).padStart(2, '0')]++;
      });

      // branchDict를 배열로 변환하여 순서 보장
      const branchArray = Object.keys(branchDict)
      .map(branchName => ({ name: branchName, data: branchDict[branchName] }))
      .sort((a, b) => {
        const aBranch = parseInt(a.name.replace('호점', '')); // '1호점' -> 1
        const bBranch = parseInt(b.name.replace('호점', '')); // '2호점' -> 2
        return aBranch - bBranch; // 호점 순으로 정렬
      });

      // dateDict를 Record<string, string | number>[] 형식으로 변환
      const result = Object.keys(dateDict).map(dateKey => {
        const row: Record<string, string | number> = { name: dateKey };

        // branchArray를 순서대로 처리하여 각 호점의 출석 데이터를 추가
        branchArray.forEach(({ name, data }) => {
          row[name] = data[dateKey] || 0; // 해당 날짜의 출석 수 추가
        });
        
        return row;
      })

      return result;
    } else {
      res.forEach((user) => {
        dateDict[String(user.createdAt.getFullYear()) + String((user.createdAt.getMonth() + 1)).padStart(2, '0') + String(user.createdAt.getDate()).padStart(2, '0')]++;
      })

      // dateDict를 Record<string, string | number>[] 형식으로 변환
      const chartData = Object.keys(dateDict).map((dateKey) => ({
        name: dateKey, // 날짜 (예: '20241015')
        count: dateDict[dateKey], // 해당 날짜의 사용자 수
      }));

      return chartData;
    }
  }

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
        createdAt: Between(new Date(year, month, day, 0, 0, 0), new Date(year, month, day, 23, 59, 59))
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
