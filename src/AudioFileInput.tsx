import { useRef } from "preact/hooks";

export const AudioFileInput = (
  { onChange }: { onChange: (file: File | null) => void },
) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <label
        for="file-input"
        type="button"
        tabIndex={0}
        onKeyPress={(e) =>
          ["Space", "Enter"].includes(e.code) &&
          inputRef.current?.click()}
      >
        Select Audio
      </label>
      <input
        id="file-input"
        ref={inputRef}
        type="file"
        multiple
        accept="audio/*"
        onChange={(e) =>
          onChange(
            (e.target as HTMLInputElement).files?.item(0) || null,
          )}
        style="display: none;"
      />
    </>
  );
};
