import { Module } from '@nestjs/common';
import { VoiceToTextController } from './voice-to-text.controller';
import { VoiceToTextService } from './voice-to-text.service';
import { VoiceToTextGateway } from './voice-to-text.gateway';

@Module({
  controllers: [VoiceToTextController],
  providers: [VoiceToTextService, VoiceToTextGateway],
})
export class VoiceToTextModule {}
