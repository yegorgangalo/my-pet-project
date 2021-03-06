import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from 'src/modules/users/users.service';
import { MailService } from 'src/modules/mail/mail.service';
import { TokenService } from 'src/modules/token/token.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UserDto } from 'src/modules/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private mailService: MailService,
    private tokenService: TokenService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.loginUser(user);
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
    return this.loginUser(userDB);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'User with such email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.registerUser(userDto);
    return this.loginUser(user);
  }

  async registerUser(userDto: CreateUserDto) {
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const activateAccountKey = uuidv4();
    const user = await this.userService.create({
      ...userDto,
      activateAccountKey,
      password: hashPassword,
    });
    this.mailService.sendActivationMail(userDto.email, activateAccountKey);
    return user;
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

  async loginUser(user) {
    const { accessToken, refreshToken } =
      this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(user._id, refreshToken);
    return { accessToken, refreshToken, user: new UserDto(user) };
  }

  private unAuthExcMessage = { message: 'Wrong email or password' };
}
