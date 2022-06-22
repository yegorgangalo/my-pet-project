import { ENV } from '@mandruy/common/const';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from 'src/modules/users/users.service';
import { TokenService } from 'src/modules/token/token.service';
import { UserDto } from 'src/modules/users/dto/user.dto';

@Injectable()
export class AuthGoogleService {
  clientID: string;
  oAuth2Client: OAuth2Client;
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private tokenService: TokenService,
  ) {
    this.clientID = this.configService.get(ENV.GOOGLE_AUTH_CLIENT_ID);
    this.oAuth2Client = new OAuth2Client(this.clientID);
  }

  async login(token: string) {
    try {
      const ticket = await this.oAuth2Client.verifyIdToken({
        idToken: token,
        audience: this.clientID, // Specify the CLIENT_ID of the app that accesses the backend
        // for multiple clients: [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });

      const payload = ticket.getPayload();
      const { email, email_verified } = payload;
      const user = await this.validateUser({ email, email_verified });
      const { accessToken, refreshToken } =
        this.tokenService.generateTokens(user);
      await this.tokenService.saveToken(user._id, refreshToken);
      return { accessToken, refreshToken, user: new UserDto(user) };
    } catch (err) {
      console.log('google auth error:', err);
      return err;
    }
  }

  private async validateUser({ email, email_verified }) {
    if (!email_verified) {
      throw new UnauthorizedException(this.unVerifiedExcMessage);
    }
    const userDB = await this.userService.getUserByEmail(email);
    if (!userDB) {
      throw new UnauthorizedException(this.unRegisteredExcMessage);
    }
    return userDB;
  }

  private unVerifiedExcMessage = { message: 'User has unverified email' };
  private unRegisteredExcMessage = { message: 'User is not registered' };
}
