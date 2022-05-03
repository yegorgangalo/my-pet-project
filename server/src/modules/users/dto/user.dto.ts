import mongoose from 'mongoose';
import { User } from 'src/modules/users/users.schema';
import { Role } from 'src/modules/roles/roles.schema';

export class UserDto {
  readonly _id: mongoose.Schema.Types.ObjectId;
  readonly name: string;
  readonly email: string;
  readonly roles: Array<mongoose.Schema.Types.ObjectId | Role>;
  readonly isActivated: boolean;

  constructor(user: User) {
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.roles = user.roles;
    this.isActivated = user.isActivated;
  }
}
