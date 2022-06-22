import { COOKIE } from '@mandruy/common/const';
import { Controller, Body, Post, Res } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { TokenDto } from 'src/modules/token/dto/token.dto';
import TokenVerificationDto from './dto/token-verification.dto';
import { getRefreshTokenCookieOptions } from 'src/utils/getRefreshTokenCookieOptions';

@ApiTags('AuthGoogle')
@Controller('auth-google')
export class AuthGoogleController {
  constructor(private authGoogleService: AuthGoogleService) {}

  @ApiOperation({ summary: 'user login by google' })
  @ApiResponse({ status: 200, type: TokenDto })
  @Post('/login')
  async login(
    @Body() tokenVerificationDto: TokenVerificationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authGoogleService.login(tokenVerificationDto.token);
    const opts = getRefreshTokenCookieOptions();
    res.cookie(COOKIE.REFRESH_TOKEN, data.refreshToken, opts);
    res.send(data);
  }
}
