import { useState } from "preact/hooks";
import { AudioFileInput } from "./AudioFileInput";

export function App() {
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [bufferSourceNode, setBufferSourceNode] = useState<AudioBufferSourceNode | null>(null);

  const onChange = (newFile: File | null) => {
    if (!newFile) return;
    setAudioBuffer(null);
    setFile(newFile);
    const reader = new FileReader();
    reader.onloadend = e => {
      const result = e.target?.result;
      if (!result || typeof result !== 'object') return;
      new AudioContext()
        .decodeAudioData(result)
        .then(setAudioBuffer)
    }
    reader.readAsArrayBuffer(newFile)
  }

  const play = () => {
    if (!audioBuffer) return;
    const audioContext = new AudioContext();
    const bufferSourceNode = audioContext.createBufferSource()
    bufferSourceNode.buffer = audioBuffer;
    bufferSourceNode.connect(audioContext.destination);
    bufferSourceNode.start();
    bufferSourceNode.onended = () => setBufferSourceNode(null);
    setBufferSourceNode(bufferSourceNode);
  }

  const stop = () =>  {
    if (!bufferSourceNode) return;
    bufferSourceNode.stop();
    setBufferSourceNode(null);
  }

  return (
    <>
      <AudioFileInput onChange={onChange} />
      {file && <p>{file.name}</p>}
      {audioBuffer && <p>{audioBuffer.length} {audioBuffer.numberOfChannels}</p>}
      {audioBuffer && !bufferSourceNode && <button onClick={play}>Play</button>}
      {bufferSourceNode && <button onClick={stop}>Stop</button>}
    </>
  );
}
