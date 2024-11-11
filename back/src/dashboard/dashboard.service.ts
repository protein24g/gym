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
    this.userService.getUserConut(payload),
    this.trainerService.getTrainerCount(payload),
    this.attendanceService.getTodayAttendanceCount(payload),
    this.userService.getDailyUserRegisters(payload)
  ];

  // OWNER 권한인 경우에만 branchCount를 추가
  if (payload.role === RoleType.OWNER) {
    res.push(this.branchService.getBranchCount());
  }

  // Promise.all을 사용하여 병렬 처리
  const [userCount, trainerCount, todayAttendanceCount, dailyUserRegisters, branchCount] = await Promise.all(res);

  const summaryInfo: SummaryInfo = {
    userCount: userCount as number,
    trainerCount: trainerCount as number,
    todayAttendanceCount: todayAttendanceCount as number,
    dailyUserRegisters: dailyUserRegisters as { name: string; count: number }[],
  };

  // OWNER 권한일 때만 branchCount 포함
  if (payload.role === RoleType.OWNER) {
    summaryInfo.branchCount = branchCount as number;
  }

  return summaryInfo;
  }
}
