import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';

@Controller('voice-to-text')
export class VoiceToTextController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'endGoogleCloudStreamResult').pipe(
      map((data: string) => {
        console.log('rxjs map data ===>>>', data);
        return { data } as MessageEvent;
      }),
    );
  }
}
