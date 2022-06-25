import { useRef } from "preact/hooks";

type Props = { onChange: (files: FileList) => void };

export const AudioFileInput = ({ onChange }: Props) => {
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
        onChange={(e) => {
          const files = (e.target as HTMLInputElement).files;
          files && onChange(files);
        }}
        style="display: none;"
      />
    </>
  );
};
