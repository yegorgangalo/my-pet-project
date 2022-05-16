import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
// import { UsersService } from '../users/users.service';
// import { AuthenticationService } from '../authentication/authentication.service';
// import User from '../users/user.entity';

@Injectable()
export class AuthGoogleService {
  oauthClient: Auth.OAuth2Client;
  constructor(private readonly configService: ConfigService) {
    const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async login(token: string) {
    console.log('token=', token);
  }

  // async authenticate(token: string) {
  //   const tokenInfo = await this.oauthClient.getTokenInfo(token);

  //   const email = tokenInfo.email;

  //   try {
  //     const user = await this.usersService.getByEmail(email);

  //     return this.handleRegisteredUser(user);
  //   } catch (error) {
  //     if (error.status !== 404) {
  //       throw new error();
  //     }

  //     return this.registerUser(token, email);
  //   }
  // }
}
