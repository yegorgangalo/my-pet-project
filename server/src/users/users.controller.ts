import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UsersService } from './users.service';
import { User } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { AddUserRoleDto } from './dto/add-user-role.dto';
import { ROLES } from 'src/common/const';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @ApiOperation({ summary: 'Get one user by id' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.usersService.getOne(id);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, type: User })
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.usersService.delete(id);
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @ApiOperation({ summary: 'Add role for user' })
  @ApiResponse({ status: 200, type: User })
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Post('/role')
  addRole(@Body() dto: AddUserRoleDto) {
    return this.usersService.addRole(dto);
  }

  @ApiOperation({ summary: 'Activate user from email' })
  @Get('/activate/:link')
  // @Redirect(this.configService.get<string>('MONGODB_URI'), 301)
  activate(@Param('link') link: string, @Res() res) {
    this.usersService.activate(link);
    res.redirect(this.configService.get<string>('CLIENT_URL'));
  }
}
