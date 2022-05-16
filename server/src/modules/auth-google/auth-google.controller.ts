import { ENV, COOKIE } from '@mandruy/common/const';
import { Controller, Body, Post, Res, Req, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGoogleService } from './auth-google.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import TokenVerificationDto from './dto/token-verification.dto';

@ApiTags('AuthGoogle')
@Controller('auth-google')
export class AuthGoogleController {
  constructor(
    private authGoogleService: AuthGoogleService,
    private configService: ConfigService,
  ) {}

  @Post('/login')
  async login(
    @Body() tokenVerificationDto: TokenVerificationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authGoogleService.login(tokenVerificationDto.token);
    res.send(data);
  }
}
