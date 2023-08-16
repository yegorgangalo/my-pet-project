import { Injectable } from '@nestjs/common';
import googleSpeech from '@google-cloud/speech';

@Injectable()
export class VoiceToTextService {
  speechClient = null;
  recognizeStream = null;

  REQUEST_OPTIONS = {
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'uk-UA', //'en-US'
      alternativeLanguageCodes: ['en-US', 'ko-KR'],
      enableWordTimeOffsets: true,
      enableAutomaticPunctuation: true,
      enableWordConfidence: true,
      enableSpeakerDiarization: true,
      //diarizationSpeakerCount: 2,
      //model: 'video',
      model: 'command_and_search',
      //model: 'default',
      useEnhanced: true,
    },
    interimResults: true,
  };

  constructor() {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = './speech-to-text-key.json';
    if (!this.speechClient) {
      this.speechClient = new googleSpeech.SpeechClient();
    }
  }

  async startRecognitionStream(socketServer) {
    console.log('* StartRecognitionStream\n');
    try {
      this.recognizeStream = this.speechClient
        .streamingRecognize(this.REQUEST_OPTIONS)
        .on('error', err => {
          console.error('streamingRecognize onerror:', err.message);
        })
        .on('data', data => {
          const result = data.results[0];
          const isFinal = result.isFinal;

          const transcription = data.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

          console.log(`Transcription: `, transcription);

          socketServer.emit('receive_audio_text', {
            text: transcription,
            isFinal,
          });

          // if end of utterance, let's restart stream
          // this is a small hack to keep restarting the stream on the server and keep the connection with Google api
          // Google api disconnects the stream every five minutes
          if (data.results[0] && data.results[0].isFinal) {
            this.stopRecognitionStream();
            this.startRecognitionStream(socketServer);
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
