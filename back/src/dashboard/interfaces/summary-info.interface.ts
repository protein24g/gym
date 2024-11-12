interface SummaryInfo {
  userCount: number;
  trainerCount: number;
  todayAttendanceCount: number;
  dailyUserRegisters: { name: string; count: number }[];
  branchCount?: number;
  branchUserCount?: { name: string; count: number }[];
}
