import { forwardRef, Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { TokenModule } from 'src/token/token.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [TokenModule, MailModule, forwardRef(() => UsersModule)],
  exports: [AuthService],
})
export class AuthModule {}
