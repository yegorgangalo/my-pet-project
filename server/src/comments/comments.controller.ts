import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './create-comment.dto';
import { Comment } from './comments.schema';

@ApiTags('Comments')
@Controller('comment')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}
  @ApiOperation({ summary: 'add comment by user' })
  @ApiResponse({ status: 200, type: Comment })
  @Post()
  addComment(@Body() dto: CreateCommentDto) {
    return this.commentsService.addComment(dto);
  }
}
