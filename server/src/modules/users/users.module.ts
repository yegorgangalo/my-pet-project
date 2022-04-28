import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './users.schema';
import { Comment, CommentSchema } from '../comments/comments.schema';
import { Role, RoleSchema } from '../roles/roles.schema';
import { AuthModule } from 'src/modules/auth/auth.module';
import { RolesModule } from 'src/modules/roles/roles.module';
import { TokenModule } from 'src/modules/token/token.module';
import { HttpCacheModule } from 'src/modules/http-cache/http-cache.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
    forwardRef(() => AuthModule),
    RolesModule,
    TokenModule,
    HttpCacheModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
