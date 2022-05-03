import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/modules/roles/roles.schema';
import { Comment } from 'src/modules/comments/comments.schema';

export type UserDocument = User & mongoose.Document;

@Schema({ versionKey: false })
export class User {
  // @Prop({ unique: true })
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ example: 'Petro Petruk', description: 'user name' })
  @Prop()
  name: string;

  @ApiProperty({ example: 'user@gmail.com', description: 'user email' })
  @Prop()
  email: string;

  @ApiProperty({ example: '12345678', description: 'password' })
  @Prop()
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  roles: Array<mongoose.Schema.Types.ObjectId | Role>; // roles: Role[];

  @ApiProperty({ example: false, description: 'Is user activated by email' })
  @Prop({ default: false })
  isActivated: boolean;

  @ApiProperty({
    example: '12345678',
    description: 'activation link from email',
  })
  @Prop()
  activateAccountKey: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
