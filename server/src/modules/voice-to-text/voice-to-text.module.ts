import { Module, Logger } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FilesModule } from 'src/modules/files/files.module';
import { VoiceToTextController } from './voice-to-text.controller';
import { VoiceToTextService } from './voice-to-text.service';
import { VoiceToTextGateway } from './voice-to-text.gateway';

@Module({
  imports: [EventEmitterModule.forRoot(), FilesModule],
  controllers: [VoiceToTextController],
  providers: [VoiceToTextService, VoiceToTextGateway, Logger],
})
export class VoiceToTextModule {}
