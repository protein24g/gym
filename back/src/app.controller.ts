import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RoleGuard } from './auth/roles/guards/role.guard';

@Controller()
@UseGuards(JwtAuthGuard, RoleGuard)
export class AppController {
  constructor() {}
}
