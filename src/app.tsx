import { useAppState } from "./useAppState";
import { AudioFileInput } from "./AudioFileInput";

export function App() {
  const { state, dispatch } = useAppState();

  return (
    <>
      <AudioFileInput onChange={(file) => dispatch({ type: "load", file })} />
      {state.status !== "empty" && (
        <article>
          <p>{state.name}</p>
          <p>{state.duration.toFixed(2)}s</p>
          <p>{state.numberOfChannels} channel(s)</p>
          <button
            onClick={state.status === "playing"
              ? () => dispatch({ type: "stop" })
              : () => dispatch({ type: "play" })}
          >
            {state.status === "playing" ? "Stop" : "Play"}
          </button>
          <label>
            loop:{" "}
            <input
              type="checkbox"
              disabled={state.status === "playing"}
              checked={state.loop}
              onChange={(e) =>
                dispatch({
                  type: "setLoop",
                  loop: (e.target as HTMLInputElement).checked,
                })}
            />
          </label>
        </article>
      )}
    </>
  );
}
