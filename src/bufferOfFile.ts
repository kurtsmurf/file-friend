import { Guy } from "./useAppState";

export function guyOfFile(
  audioContext: AudioContext,
  file: File,
): Promise<Guy> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const result = e.target?.result;
      if (result && typeof result === "object") {
        audioContext
          .decodeAudioData(result)
          .then((ab) => {
            resolve({
              name: file.name,
              buffer: ab,
              loop: false,
              playbackRate: 1.0,
            });
          })
          .catch(reject);
      } else {
        reject();
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
