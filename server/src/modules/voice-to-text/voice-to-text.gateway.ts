import * as socketIo from 'socket.io';
import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { VoiceToTextService } from './voice-to-text.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class VoiceToTextGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private voiceToTextService: VoiceToTextService,
    private logger: Logger,
  ) {}

  @WebSocketServer()
  server: socketIo.Server;

  handleDisconnect(client: socketIo.Socket) {
    this.logger.log(`disconnected: ${client.id}`);
  }

  handleConnection(client: socketIo.Socket) {
    this.logger.log(`connected: ${client.id}`);
  }

  afterInit() {
    this.logger.log(`SOCKET SERVER initialized`);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(@MessageBody() message: string): void {
    this.logger.log(`msgToServer socket event data => ${message}`);
    setTimeout(() => {
      this.server.emit('msgToClient', 'got this message => ' + message);
    }, 1000);
  }

  @SubscribeMessage('startGoogleCloudStream')
  async handleStartGoogleCloudStream(): Promise<void> {
    this.logger.log(`startGoogleCloudStream socket event`);
    this.voiceToTextService.startRecognitionStream();
  }

  @SubscribeMessage('endGoogleCloudStream')
  handleStopGoogleCloudStream(): void {
    this.logger.log('** ending google cloud stream **\n');
    this.voiceToTextService.stopRecognitionStream();
  }

  @SubscribeMessage('send_audio_data')
  handleSendAudioData(@MessageBody() audioData: { audio: any }): void {
    this.voiceToTextService.writeAudioData(audioData);
    this.server.emit('msgToClient', 'Got audio data');
  }

  @OnEvent('receive_google_audio_text')
  handleEvent(data: { text: string; isFinal: boolean }) {
    this.server.emit('receive_audio_text', data);
  }
}
