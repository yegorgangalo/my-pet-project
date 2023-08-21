import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import googleSpeech from '@google-cloud/speech';
import { FilesService } from 'src/modules/files/files.service';

@Injectable()
export class VoiceToTextService {
  private speechClient = null;
  private recognizeStream = null;
  private transcriptedText = '';

  private STREAM_CONFIG = {
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'uk-UA', //'en-US'
      alternativeLanguageCodes: ['ru-RU'],
      enableWordTimeOffsets: true,
      enableAutomaticPunctuation: true,
      enableWordConfidence: true,
      enableSpeakerDiarization: true,
      //   diarizationSpeakerCount: 2,
      //   minSpeakerCount: 2,
      //   maxSpeakerCount: 2,
      //   model: 'medical_conversation', not for ua-ru
      model: 'command_and_search',
      useEnhanced: true,
    },
    interimResults: true,
  };

  constructor(
    private eventEmitter: EventEmitter2,
    private filesService: FilesService,
  ) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = './speech-to-text-key.json';
    if (!this.speechClient) {
      this.speechClient = new googleSpeech.SpeechClient();
    }
  }

  set transcription(data: string) {
    this.transcriptedText = data;
  }
  get transcription() {
    return this.transcriptedText;
  }

  async startRecognitionStream() {
    console.log('* StartRecognitionStream\n');
    try {
      this.recognizeStream = await this.speechClient.streamingRecognize(
        this.STREAM_CONFIG,
      );
      this.recognizeStream.on('error', (err: Error) => {
        console.error('streamingRecognize onerror:', err.message);
      });
      this.recognizeStream.on('finish', async () => {
        console.log(
          'streamingRecognize finish transcription:',
          this.transcription,
        );
        const file = {
          originalname: 'audio-to-text.txt',
          buffer: this.transcription,
        };
        const fileName = await this.filesService.createFile(file);
        console.log('fileName=', fileName);
      });
      this.recognizeStream.on('data', data => {
        const result = data.results[0];
        const isFinal = result.isFinal;

        const transcription = data.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');

        console.log(`Transcription: `, transcription);
        this.transcription = transcription;

        this.eventEmitter.emit('receive_google_audio_text', {
          text: transcription,
          isFinal,
        });

        // if end of utterance, let's restart stream
        // this is a small hack to keep restarting the stream on the server and keep the connection with Google api
        // Google api disconnects the stream every five minutes
        if (isFinal) {
          this.stopRecognitionStream();
          this.startRecognitionStream();
          console.log('restarted stream serverside');
        }
      });
    } catch (err) {
      console.error('Error streaming google api ' + err);
    }
  }

  stopRecognitionStream() {
    if (this.recognizeStream) {
      console.log('* StopRecognitionStream \n');
      this.recognizeStream.end();
    }
    this.recognizeStream = null;
    this.eventEmitter.emit('endGoogleCloudStreamResult', this.transcription);
  }

  writeAudioData(audioData: { audio: any }) {
    if (!this.recognizeStream) {
      console.log('RecognizeStream is null');
      return;
    }
    try {
      this.recognizeStream.write(audioData.audio);
    } catch (err) {
      console.log('Error calling google api:' + err);
    }
  }
}
