import mongoose from 'mongoose';
import { User } from 'src/users/users.schema';
import { Role } from 'src/roles/roles.schema';

export class UserDto {
  readonly name: string;
  readonly email: string;
  readonly roles: Array<mongoose.Schema.Types.ObjectId | Role>;
  readonly isActivated: boolean;

  constructor(user: User) {
    this.name = user.name;
    this.email = user.email;
    this.roles = user.roles;
    this.isActivated = user.isActivated;
  }
}
