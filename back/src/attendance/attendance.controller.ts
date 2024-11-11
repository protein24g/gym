import { Body, Controller, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AttendanceDTO } from './dto/attendance.dto';
import { Roles } from 'src/auth/roles/decorators/role.decorator';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';

@Controller('api/attendance')
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
}