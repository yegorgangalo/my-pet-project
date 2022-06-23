import { Module } from '@nestjs/common';
import { AuthGoogleController } from './auth-google.controller';
import { AuthGoogleService } from './auth-google.service';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [AuthGoogleController],
  providers: [AuthGoogleService],
  imports: [UsersModule, AuthModule],
})
export class AuthGoogleModule {}
