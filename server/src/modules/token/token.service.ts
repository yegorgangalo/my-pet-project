import { ENV } from '@mandruy/common/const';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/users/users.schema';
import { CreateTokenPayloadDto } from 'src/modules/token/dto/create-token-payload.dto';
import { Role } from 'src/modules/roles/roles.schema';
import { TokenDto } from 'src/modules/token/dto/token.dto';
import { Token, TokenDocument } from './token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateTokens(user: User): TokenDto {
    const payload: CreateTokenPayloadDto = {
      _id: user._id,
      email: user.email,
      roles: user.roles as Role[],
    };

    const accessExpiresIn = this.configService.get(
      ENV.JWT_ACCESS_EXPIRATION_TIME,
    );
    const refreshExpiresIn = this.configService.get(
      ENV.JWT_REFRESH_EXPIRATION_TIME,
    );

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: accessExpiresIn,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: refreshExpiresIn,
      }),
    };
  }

  async saveToken(userId: ObjectId, refreshToken: string) {
    const existedTokenData = await this.tokenModel.findOne({ user: userId });
    if (existedTokenData) {
      existedTokenData.refreshToken = refreshToken;
      return await existedTokenData.save();
    }

    const payload: Token = {
      refreshToken,
      user: userId,
    };
    const tokenData = await this.tokenModel.create(payload);
    return tokenData;
  }

  async removeToken(refreshToken: string) {
    const removedToken = await this.tokenModel.findOneAndRemove({
      refreshToken,
    });
    return removedToken._id;
  }

  async findToken(refreshToken: string) {
    const foundToken = await this.tokenModel.findOne({
      refreshToken,
    });
    return foundToken;
  }

  validateToken(token: string) {
    try {
      const userData = this.jwtService.verify(token);
      return userData as CreateTokenPayloadDto;
    } catch (err) {
      return null;
    }
  }
}
