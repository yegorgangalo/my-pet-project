import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type RoleDocument = Role & mongoose.Document;

@Schema({ versionKey: false })
export class Role {
  //   @Prop({ unique: true })
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({
    example: 'specialUser',
    description: 'user with special possibilities',
  })
  @Prop({ unique: true, allowNull: false })
  value: string;

  @ApiProperty({
    example: 'role details',
    description: 'description of the role',
  })
  @Prop({ default: 'one of roles of the user' })
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
