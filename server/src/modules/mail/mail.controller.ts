import { Controller, Param, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { MailService } from './mail.service';
import { UsersService } from '../users/users.service';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'send activation mail to user' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async sendActivationMail(@Param('userId') userId: ObjectId) {
    const { email, activateAccountKey } = await this.usersService.getOne(
      userId,
    );
    return this.mailService.sendActivationMail(email, activateAccountKey);
  }
}
