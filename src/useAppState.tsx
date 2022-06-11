import { useEffect, useState } from "preact/hooks";

type AppEvent =
  | { type: "load"; file: File }
  | { type: "play" }
  | { type: "stop" }
  | { type: "setLoop"; loop: boolean };



type AppState =
  | { status: "empty" }
  | {
    status: "stopped" | "playing";
    name: string;
    duration: number;
    numberOfChannels: number;
    loop: boolean;
  };

export const useAppState = () => {
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [bufferSourceNode, setBufferSourceNode] = useState<
    AudioBufferSourceNode | null
  >(null);
  const [loop, setLoop] = useState(false);

  useEffect(stop, [file]);

  function loadFile(newFile: File | null) {
    if (!newFile) {
      return;
    }
    setAudioBuffer(null);
    setFile(newFile);
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const result = e.target?.result;
      if (!result || typeof result !== "object") {
        return;
      }
      new AudioContext()
        .decodeAudioData(result)
        .then(setAudioBuffer);
    };
    reader.readAsArrayBuffer(newFile);
  }

  function play() {
    if (!audioBuffer) {
      return;
    }
    const audioContext = new AudioContext();
    const bufferSourceNode = audioContext.createBufferSource();
    bufferSourceNode.buffer = audioBuffer;
    bufferSourceNode.connect(audioContext.destination);
    bufferSourceNode.onended = stop;
    bufferSourceNode.loop = loop;
    bufferSourceNode.start();
    setBufferSourceNode(bufferSourceNode);
  }

  function stop() {
    bufferSourceNode?.stop();
    setBufferSourceNode(null);
  }

  const state: AppState = file && audioBuffer
    ? {
      status: bufferSourceNode ? "playing" : "stopped",
      name: file.name,
      duration: audioBuffer.duration,
      numberOfChannels: audioBuffer.numberOfChannels,
      loop: false,
    }
    : { status: "empty" };

  const dispatch = (event: AppEvent) => {
    switch (event.type) {
      case "load": {
        return loadFile(event.file);
      }
      case "play": {
        return play();
      }
      case "stop": {
        return stop();
      }
      case "setLoop": {
        return setLoop(event.loop);
      }
    }
  };

  return { state, dispatch };
};
