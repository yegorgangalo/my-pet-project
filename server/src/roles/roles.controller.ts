import { Controller, Body, Post, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ROLES } from 'src/common/const';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './create-role.dto';
import { Role } from './roles.schema';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiOperation({ summary: 'get list of roles' })
  @ApiResponse({ status: 200, type: [Role] })
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.rolesService.getAll();
  }

  @ApiOperation({ summary: 'get role by value' })
  @ApiResponse({ status: 200, type: Role })
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Get('/:value')
  getByValue(@Param('value') value: string) {
    return this.rolesService.getByValue(value);
  }

  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({ status: 200, type: Role })
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }
}
