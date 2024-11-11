import { forwardRef, Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UserModule } from 'src/member/user/user.module';
import { BranchModule } from 'src/branches/branch.module';
import { TrainerModule } from 'src/member/trainer/trainer.module';
import { AttendanceModule } from 'src/attendance/attendance.module';

@Module({
  imports: [
    forwardRef(() => BranchModule),
    forwardRef(() => UserModule),
    forwardRef(() => TrainerModule),
    forwardRef(() => AttendanceModule),
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
