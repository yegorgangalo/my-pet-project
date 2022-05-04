import { AWS } from '@mandruy/common/const';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { User } from 'src/modules/users/users.schema';
import { Role } from 'src/modules/roles/roles.schema';

export class UserDto {
  readonly _id: mongoose.Schema.Types.ObjectId;
  readonly name: string;
  readonly email: string;
  readonly avatar: string;
  readonly roles: Array<mongoose.Schema.Types.ObjectId | Role>;
  readonly isActivated: boolean;
  private configService: ConfigService;

  constructor(user: User) {
    this.initConfigService();
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    // this.avatar = this.getEnvValue(ENV.SERVER_URL) + '/' + user.avatar;
    this.avatar = this.getEnvValue(AWS.AWS_S3_BUCKET) + '/' + user.avatar;
    this.roles = user.roles;
    this.isActivated = user.isActivated;
  }

  initConfigService() {
    this.configService = new ConfigService();
  }

  getEnvValue(envValue) {
    return this.configService.get<string>(envValue);
  }
}
