import { Module } from '@nestjs/common';
import { AuthGoogleController } from './auth-google.controller';
import { AuthGoogleService } from './auth-google.service';
import { UsersModule } from 'src/modules/users/users.module';
import { TokenModule } from 'src/modules/token/token.module';

@Module({
  controllers: [AuthGoogleController],
  providers: [AuthGoogleService],
  imports: [UsersModule, TokenModule],
})
export class AuthGoogleModule {}
