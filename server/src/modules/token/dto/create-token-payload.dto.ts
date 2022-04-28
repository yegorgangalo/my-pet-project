import mongoose from 'mongoose';
import { Role } from 'src/modules/roles/roles.schema';

export class CreateTokenPayloadDto {
  readonly _id: mongoose.Schema.Types.ObjectId;
  readonly email: string;
  readonly roles: Role[];
}
