import { Injectable } from '@nestjs/common';
import { AttendanceService } from 'src/attendance/attendance.service';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';
import { BranchService } from 'src/branches/branch.service';
import { TrainerService } from 'src/member/trainer/trainer.service';
import { UserService } from 'src/member/user/user.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly branchService: BranchService,
    private readonly userService: UserService,
    private readonly trainerService: TrainerService,
    private readonly attendanceService: AttendanceService,
  ) {}

  async getDashboardSummary(payload: AuthPayload): Promise<SummaryInfo> {
    const res = [
    await this.userService.getUserConut(payload),
    await this.trainerService.getTrainerCount(payload),
    await this.attendanceService.getTodayAttendanceCount(payload),
    await this.userService.getRecentMonthUserRegisters(payload),
    await this.attendanceService.getRecentMonthAttendance(payload),
  ];

  // OWNER 권한인 경우에만 branchCount를 추가
  if (payload.role === RoleType.OWNER) {
    res.push(await this.branchService.getBranchCount());
    res.push(await this.branchService.getBranchUserCount());
  }

  const [userCount, trainerCount, todayAttendanceCount, dailyUserRegisters, userAttendances, branchCount, branchUserCount] = res;
  const summaryInfo: SummaryInfo = {
    userCount: userCount as number,
    trainerCount: trainerCount as number,
    todayAttendanceCount: todayAttendanceCount as number,
    dailyUserRegisters: dailyUserRegisters as { name: string; count: number }[],
    userAttendances: userAttendances as { name: string; count: number }[]
  };

  // OWNER 권한일 때만 branchCount 포함
  if (payload.role === RoleType.OWNER) {
    summaryInfo.branchCount = branchCount as number;
    summaryInfo.branchUserCount = branchUserCount as { name: string, count: number }[];
  }

  return summaryInfo;
  }
}
