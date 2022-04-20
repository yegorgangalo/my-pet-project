// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose from 'mongoose';
// import { ApiProperty } from '@nestjs/swagger';
// import { User } from '../users/users.schema';

// export type TokenDocument = Token & mongoose.Document;

// @Schema({ versionKey: false })
// export class Token {
//   _id: mongoose.Schema.Types.ObjectId;

//   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
//   user: User;

//   @ApiProperty({
//     example: 'a8sd6as8d68asd68as7d',
//     description: 'Token to refresh access token',
//   })
//   @Prop({ required: true })
//   refreshToken: string;
// }

// export const TokenSchema = SchemaFactory.createForClass(Token);
