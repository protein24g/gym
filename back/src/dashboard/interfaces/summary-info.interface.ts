interface SummaryInfo {
  branchCount?: number;
  userCount: number;
  trainerCount: number;
  todayAttendanceCount: number;
  dailyUserRegisters: { name: string; count: number }[];
}
