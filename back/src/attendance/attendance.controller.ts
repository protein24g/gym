import { Body, Controller, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiTags } from '@nestjs/swagger';
import { AttendanceDTO } from './dto/attendance.dto';

@Controller('api/attendance')
@ApiTags('Attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async checkIn(@Body() attendanceDTO: AttendanceDTO) {
    await this.attendanceService.checkIn(attendanceDTO.telNumber);
  }

}