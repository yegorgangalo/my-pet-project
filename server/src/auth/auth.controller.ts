import { ENV, COOKIE } from 'src/common/const';
import { Controller, Body, Post, Res, Req, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { TokenDto } from 'src/token/dto/token.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'user login' })
  @ApiResponse({ status: 200, type: TokenDto })
  @Post('/login')
  async login(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.login(userDto);
    const opts = this.getRefreshTokenCookieOptions();
    res.cookie(COOKIE.REFRESH_TOKEN, data.refreshToken, opts);
    res.send(data);
  }

  @ApiOperation({ summary: 'user registration' })
  @ApiResponse({ status: 200, type: TokenDto })
  @Post('/registration')
  async registration(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.registration(userDto);
    const opts = this.getRefreshTokenCookieOptions();
    res.cookie(COOKIE.REFRESH_TOKEN, data.refreshToken, opts);
    res.send(data);
  }

  @ApiOperation({ summary: 'user logout' })
  @ApiResponse({ status: 200, type: String })
  @Get('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies[COOKIE.REFRESH_TOKEN];
    const token = await this.authService.logout(refreshToken);
    res.clearCookie(COOKIE.REFRESH_TOKEN);
    res.send(token);
  }

  @ApiOperation({ summary: 'refresh token' })
  @ApiResponse({ status: 200, type: String })
  @Get('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies[COOKIE.REFRESH_TOKEN];
    const data = await this.authService.refresh(refreshToken);
    const opts = this.getRefreshTokenCookieOptions();
    res.cookie(COOKIE.REFRESH_TOKEN, data.refreshToken, opts);
    res.send(data);
  }

  getRefreshTokenCookieOptions() {
    const refreshExpiresIn = this.configService.get(
      ENV.JWT_REFRESH_EXPIRATION_TIME,
    );
    const maxAge = parseInt(refreshExpiresIn, 10) * 24 * 60 * 60 * 1000;
    return {
      maxAge,
      httpOnly: true,
      // secure: true, // for https
    };
  }
}
