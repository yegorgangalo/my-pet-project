import { ENV } from '@mandruy/common/const';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from 'src/modules/users/users.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { User } from 'src/modules/users/users.schema';

interface NotRegUser {
  isNotRegistered: boolean;
}

@Injectable()
export class AuthGoogleService {
  clientID: string;
  oAuth2Client: OAuth2Client;
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private authService: AuthService,
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
      const { email, email_verified, name, picture } = payload;
      const candidate = await this.validateUser({ email, email_verified });
      const user = (candidate as NotRegUser).isNotRegistered
        ? await this.authService.registerUser({
            email,
            name,
            password: uuidv4(),
            avatar: picture,
            activateAccountKey: '', //how avoid this adding?
          })
        : (candidate as User);
      return this.authService.loginUser(user);
    } catch (err) {
      console.log('google auth error:', err.message);
      return err;
    }
  }

  private async validateUser({ email, email_verified }) {
    if (!email_verified) {
      throw new UnauthorizedException(this.unVerifiedExcMessage);
    }
    const userDB = await this.userService.getUserByEmail(email);
    return userDB || ({ isNotRegistered: true } as NotRegUser);
  }

  private unVerifiedExcMessage = { message: 'User has unverified email' };
}
