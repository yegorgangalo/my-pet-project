import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/users.schema';

export type CommentDocument = Comment & mongoose.Document;

@Schema({ versionKey: false })
export class Comment {
  @ApiProperty({ example: 'Any comment text', description: 'comment text' })
  @Prop()
  text: string;

  @ApiProperty({
    example: '6253534603d72150ebf300af',
    description: 'user id from db',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
