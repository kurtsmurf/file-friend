import { useEffect, useState } from "preact/hooks";
import { AudioFileInput } from "./AudioFileInput";

export function App() {
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [bufferSourceNode, setBufferSourceNode] = useState<
    AudioBufferSourceNode | null
  >(null);
  const [loop, setLoop] = useState(false)

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

  return (
    <>
      <AudioFileInput onChange={loadFile} />
      <article>
        {file && <p>{file.name}</p>}
        {audioBuffer && <p>{audioBuffer.duration.toFixed(2)}s</p>}
        {audioBuffer && <p>{audioBuffer.numberOfChannels} channel(s)</p>}
        {audioBuffer &&
          (
            <button onClick={bufferSourceNode ? stop : play}>
              {bufferSourceNode ? "Stop" : "Play"}
            </button>
          )}
        {audioBuffer &&
          (
            <label>
              loop: <input type="checkbox" disabled={!!bufferSourceNode} checked={loop} onChange={ e => setLoop((e.target as HTMLInputElement).checked)}/>
            </label>
          )}
      </article>
    </>
  );
}
