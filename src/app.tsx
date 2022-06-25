import { useAppState } from "./useAppState";
import { AudioFileInput } from "./AudioFileInput";
import { bufferOfFile } from "./bufferOfFile";

export function App() {
  const [state, dispatch] = useAppState();

  console.log(JSON.stringify(state, null, 2));

  return (
    <>
      <AudioFileInput
        onChange={async (files) => {
          for (const file of files) {
            dispatch({ type: "load", guy: await bufferOfFile(state.audioContext, file) });
          }
        }}
      />
      {state.guys.map((buffer, index) => (
        <article key={index}>
          <p>{buffer.name}</p>
          <p>{buffer.buffer.duration.toFixed(2)}s</p>
          <p>{buffer.buffer.numberOfChannels} channel(s)</p>
          <button
            onClick={!!buffer.node
              ? () => dispatch({ type: "stop", index })
              : () => dispatch({ type: "play", index })}
          >
            {!!buffer.node ? "Stop" : "Play"}
          </button>
          <label>
            loop:{" "}
            <input
              type="checkbox"
              disabled={!!buffer.node}
              checked={buffer.loop}
              onClick={() =>
                dispatch({
                  type: "setLoop",
                  loop: !buffer.loop,
                  index,
                })}
            />
          </label>
        </article>
      ))}
    </>
  );
}
