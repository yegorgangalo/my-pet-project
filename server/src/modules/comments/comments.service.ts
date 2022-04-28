import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/users.schema';
import { Comment, CommentDocument } from './comments.schema';
import { CreateCommentDto } from './create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async addComment(dto: CreateCommentDto): Promise<Comment> {
    const user = await this.userModel.findById(dto.userId);
    const comment = await this.commentModel.create({ ...dto });
    user.comments.push(comment._id);
    await user.save();
    return comment;
  }
}
