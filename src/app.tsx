import { useAppState } from "./useAppState";
import { AudioFileInput } from "./AudioFileInput";
import { guyOfFile } from "./bufferOfFile";

export function App() {
  const [state, dispatch] = useAppState();

  console.log(JSON.stringify(state, null, 2));

  return (
    <>
      <AudioFileInput
        onChange={async (files) => {
          for (const file of files) {
            dispatch({
              type: "load",
              guy: await guyOfFile(state.audioContext, file),
            });
          }
        }}
      />
      {state.guys.map((guy, index) => (
        <article key={index}>
          <p>{guy.name}</p>
          <p>{guy.buffer.duration.toFixed(2)}s</p>
          <p>{guy.buffer.numberOfChannels} channel(s)</p>
          <button
            onClick={!!guy.node
              ? () => dispatch({ type: "stop", index })
              : () => dispatch({ type: "play", index })}
          >
            {!!guy.node ? "Stop" : "Play"}
          </button>
          <label>
            loop:{" "}
            <input
              type="checkbox"
              disabled={!!guy.node}
              checked={guy.loop}
              onClick={() =>
                dispatch({
                  type: "setLoop",
                  loop: !guy.loop,
                  index,
                })}
            />
          </label>
          <label>
            playbackRate:{" "}
            <input
              type="number"
              value={guy.playbackRate}
              onChange={(e) => {
                const value = parseFloat((e.target as HTMLInputElement).value);
                dispatch({
                  type: "setPlaybackRate",
                  value,
                  index,
                });
              }}
            />
          </label>
        </article>
      ))}
    </>
  );
}
