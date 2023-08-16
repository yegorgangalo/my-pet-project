import { useEffect, useState, useRef } from "react";
import { Button, Box } from "@mui/material";
import * as io from "socket.io-client";

const getMediaStream = () => {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: "default",
      sampleRate: 16000,
      sampleSize: 16,
      channelCount: 1,
    },
    video: false,
  });
}

interface WordRecognized {
  isFinal: boolean;
  text: string;
}

const AudioToText = () => {
  const [connection, setConnection] = useState<io.Socket>();
  const [currentRecognition, setCurrentRecognition] = useState<string>();
  const [recognitionHistory, setRecognitionHistory] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<any>();
  const processorRef = useRef<any>();
  const audioContextRef = useRef<any>();
  const audioInputRef = useRef<any>();

  console.log('connection=', connection);


  const speechRecognized = (data: WordRecognized) => {
    if (data.isFinal) {
      setCurrentRecognition("...");
      setRecognitionHistory((old) => [data.text, ...old]);
    } else {
      setCurrentRecognition(data.text + "...");
    }
  };

  useEffect(() => {
    console.log("\n\nrecognitionHistory", recognitionHistory);
  }, [recognitionHistory]);

  const connect = () => {
    connection?.disconnect();
    // const socket = io.connect("http://localhost:8081");
    const socket = io.connect("http://localhost:5001");
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setConnection(socket);
    });

    socket.emit("msgToServer", "hello world");

    socket.emit("startGoogleCloudStream");

    socket.on("msgToClient", (data) => {
      console.log("received message", data);
    });

    socket.on("receive_audio_text", (data) => {
      speechRecognized(data);
      console.log("received audio text", data);
    });

    socket.on("disconnect", () => {
      console.log("disconnected", socket.id);
    });
  };

  const disconnect = () => {
    if (!connection) return;
    connection?.emit("endGoogleCloudStream");
    connection?.disconnect();
    processorRef.current?.disconnect();
    audioInputRef.current?.disconnect();
    audioContextRef.current?.close();
    setConnection(undefined);
    setRecorder(undefined);
    setIsRecording(false);
  };

  useEffect(() => {
    (async () => {
      if (!connection) {
        console.error("No connection");
        return
      }
      if (isRecording) {
        console.error("Is Recording");
        return;
      }

        const stream = await getMediaStream();
        console.log('stream=', stream);


        audioContextRef.current = new window.AudioContext();
        console.log('audioContextRef.current=', audioContextRef.current);


        await audioContextRef.current.audioWorklet.addModule(
          "/worklets/recorderWorkletProcessor.js"
        );

        audioContextRef.current.resume();

        audioInputRef.current =
          audioContextRef.current.createMediaStreamSource(stream);

        processorRef.current = new AudioWorkletNode(
          audioContextRef.current,
          "recorder.worklet"
        );

        processorRef.current.connect(audioContextRef.current.destination);
        audioContextRef.current.resume();

        audioInputRef.current.connect(processorRef.current);

        processorRef.current.port.onmessage = (event: any) => {
          const audioData = event.data;
          connection.emit("send_audio_data", { audio: audioData });
        };
        setIsRecording(true);
    })();

    return () => {
      if (isRecording) {
        processorRef.current?.disconnect();
        audioInputRef.current?.disconnect();
        if (audioContextRef.current?.state !== "closed") {
          audioContextRef.current?.close();
        }
      }
    };
  }, [connection, isRecording, recorder]);

  return (
    <>
        <Box>
            <Button
              className={isRecording ? "btn-danger" : "btn-outline-light"}
              onClick={connect}
              disabled={isRecording}
            >
              Start
            </Button>
            <Button
              className="btn-outline-light"
              onClick={disconnect}
              disabled={!isRecording}
            >
              Stop
            </Button>
        </Box>
        <Box>
          {recognitionHistory.map((tx, idx) => (
              <p key={idx}>{tx}</p>
              ))}
          <p>{currentRecognition}</p>
        </Box>
    </>
  );
};

export default AudioToText;
