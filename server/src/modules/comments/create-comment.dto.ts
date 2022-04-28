import { ObjectId } from 'mongoose';

export class CreateCommentDto {
  readonly text: string;
  readonly userId: ObjectId;
}
