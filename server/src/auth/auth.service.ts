import { ENV } from 'src/common/const';
import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { TokenService } from 'src/token/token.service';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private mailService: MailService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    const { accessToken, refreshToken } =
      this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(user._id, refreshToken);
    return { accessToken, refreshToken, user: new UserDto(user) };
  }

  async logout(refreshToken: string) {
    const removedTokenId = await this.tokenService.removeToken(refreshToken);
    return removedTokenId;
  }

  async refresh(prevRefreshToken: string) {
    if (!prevRefreshToken) {
      throw new UnauthorizedException(this.unAuthExcMessage);
    }
    const userData = this.tokenService.validateToken(prevRefreshToken);
    const tokenFromDB = await this.tokenService.findToken(prevRefreshToken);
    if (!userData || !tokenFromDB) {
      throw new UnauthorizedException(this.unAuthExcMessage);
    }
    const userDB = await this.userService.getUserByEmail(userData.email);
    const { accessToken, refreshToken } =
      this.tokenService.generateTokens(userDB);
    await this.tokenService.saveToken(userDB._id, refreshToken);
    return { accessToken, refreshToken, user: new UserDto(userDB) };
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'User with such email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const activationLink = uuidv4();
    const user = await this.userService.create({
      ...userDto,
      activationLink,
      password: hashPassword,
    });
    const SERVER_URL = this.configService.get<string>(ENV.SERVER_URL);
    await this.mailService.sendActivationMail(
      userDto.email,
      `${SERVER_URL}/users/activate/${activationLink}`,
    );
    const { accessToken, refreshToken } =
      this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(user._id, refreshToken);
    return { accessToken, refreshToken, user: new UserDto(user) };
  }

  private async validateUser(userDto: CreateUserDto) {
    const userDB = await this.userService.getUserByEmail(userDto.email);
    if (!userDB) {
      throw new UnauthorizedException(this.unAuthExcMessage);
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      userDB.password,
    );
    if (!passwordEquals) {
      throw new UnauthorizedException(this.unAuthExcMessage);
    }
    return userDB;
  }

  private unAuthExcMessage = { message: 'Wrong email or password' };
}
