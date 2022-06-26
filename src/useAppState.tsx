import { useEffect, useReducer } from "preact/hooks";

const audioContext = new AudioContext();
const out = audioContext.createDynamicsCompressor();
out.connect(audioContext.destination);

function play(buffer: AudioBuffer, loop: boolean) {
  const bufferSourceNode = audioContext.createBufferSource();
  bufferSourceNode.buffer = buffer;
  bufferSourceNode.loop = loop;
  bufferSourceNode.connect(out);
  bufferSourceNode.start();

  return bufferSourceNode;
}

type AppEvent =
  | { type: "load"; guy: Guy }
  | { type: "play"; index: number }
  | { type: "stop"; index: number }
  | { type: "setLoop"; loop: boolean; index: number }
  | { type: "setPlaybackRate"; value: number; index: number };

export type Guy = {
  name: string;
  loop: boolean;
  buffer: AudioBuffer;
  node?: AudioBufferSourceNode;
  playbackRate: number;
};

type AppState = {
  guys: Guy[];
  audioContext: AudioContext;
};

const reducer = (state: AppState, event: AppEvent): AppState => {
  switch (event.type) {
    case "load": {
      return {
        ...state,
        guys: [...state.guys, event.guy],
      };
    }
    case "play": {
      return {
        ...state,
        guys: state.guys.map((guy, index) => {
          if (index !== event.index) return guy;

          guy.node?.stop();

          return {
            ...guy,
            node: play(guy.buffer, guy.loop),
          };
        }),
      };
    }
    case "stop": {
      return {
        ...state,
        guys: state.guys.map((guy, index) => {
          if (index !== event.index) return guy;
          guy.node?.stop();
          return {
            ...guy,
            node: undefined,
          };
        }),
      };
    }
    case "setLoop": {
      return {
        ...state,
        guys: state.guys.map((guy, index) => {
          if (index !== event.index) return guy;
          return { ...guy, loop: event.loop };
        }),
      };
    }
    case "setPlaybackRate": {
      return {
        ...state,
        guys: state.guys.map((guy, index) => {
          if (index !== event.index) return guy;

          state.guys[event.index]?.node?.playbackRate.setValueAtTime(
            event.value,
            audioContext.currentTime,
          );

          return { ...guy, playbackRate: event.value };
        }),
      };
    }
  }
};

export const useAppState = (): [AppState, (e: AppEvent) => void] => {
  const [state, dispatch] = useReducer(reducer, { audioContext, guys: [] });
  useEffect(() =>
    state.guys.forEach((guy, index) => {
      if (guy.node && !guy.node.onended) {
        guy.node.onended = () => dispatch({ type: "stop", index });
      }
    }), [state.guys]);
  return [state, dispatch];
};
