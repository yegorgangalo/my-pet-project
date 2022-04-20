import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { TokenService } from 'src/token/token.service';
// import { User } from 'src/users/users.schema';
// import { CreateTokenPayloadDto } from 'src/auth/dto/create-token-payload.dto';
// import { Role } from 'src/roles/roles.schema';
// import { TokenDto } from 'src/auth/dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    // private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.tokenService.generateToken(user);
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
    const SERVER_URL = this.configService.get<string>('SERVER_URL');
    await this.mailService.sendActivationMail(
      userDto.email,
      `${SERVER_URL}/users/activate/${activationLink}`,
    );
    return this.tokenService.generateToken(user);
  }

  // private generateToken(user: User): TokenDto {
  //   const payload: CreateTokenPayloadDto = {
  //     _id: user._id,
  //     email: user.email,
  //     roles: user.roles as Role[],
  //   };

  //   return {
  //     token: this.jwtService.sign(payload),
  //   };
  // }

  private async validateUser(userDto: CreateUserDto) {
    const userDB = await this.userService.getUserByEmail(userDto.email);
    const unAuthExcMessage = { message: 'Wrong email or password' };
    if (!userDB) {
      throw new UnauthorizedException(unAuthExcMessage);
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      userDB.password,
    );
    if (!passwordEquals) {
      throw new UnauthorizedException(unAuthExcMessage);
    }
    return userDB;
  }
}
