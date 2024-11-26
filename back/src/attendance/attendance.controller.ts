import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AttendanceDTO } from './dto/attendance.dto';
import { Roles } from 'src/auth/roles/decorators/role.decorator';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/attendances')
@ApiTags('Attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles(RoleType.USER)
  @ApiOperation({
    summary: '출석체크'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        telNumber: { type: 'number', example: '01012345678' },    
      }
    }
  })
  async checkIn(@Body() attendanceDTO: AttendanceDTO) {
    await this.attendanceService.checkIn(attendanceDTO.telNumber);
  }

  @Get('recent-month')
  @UseGuards(JwtAuthGuard)
  @Roles(RoleType.USER)
  @ApiOperation({
    summary: '최근 한달 출석 정보'
  })
  async getRecentMonthAttendance(@Req() request: Request) {
    const user = request.user as AuthPayload;
    return await this.attendanceService.getRecentMonthAttendance(user);
  }
}