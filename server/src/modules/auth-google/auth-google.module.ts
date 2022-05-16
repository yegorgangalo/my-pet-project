import { Module } from '@nestjs/common';
import { AuthGoogleController } from './auth-google.controller';
import { AuthGoogleService } from './auth-google.service';

@Module({
  controllers: [AuthGoogleController],
  providers: [AuthGoogleService],
})
export class AuthGoogleModule {}
