import { Guy } from "./useAppState";

export function bufferOfFile(file: File): Promise<Guy> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const result = e.target?.result;
      if (result && typeof result === "object") {
        new AudioContext()
          .decodeAudioData(result)
          .then(ab => {
            resolve({
              name: file.name,
              buffer: ab,
              loop: false,
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
