import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.schema';
import { CreateTokenPayloadDto } from 'src/token/dto/create-token-payload.dto';
import { Role } from 'src/roles/roles.schema';
import { TokenDto } from 'src/token/dto/token.dto';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}
  generateToken(user: User): TokenDto {
    const payload: CreateTokenPayloadDto = {
      _id: user._id,
      email: user.email,
      roles: user.roles as Role[],
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
