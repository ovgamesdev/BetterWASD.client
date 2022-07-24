import { useState, useEffect } from "react";

const useAudio = (url: string, volume = 50) => {
  const [audio] = useState(url ? new Audio(url) : null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    if (!audio) return;
    audio.volume = volume / 100;
    playing ? audio.play() : audio.pause();
  }, [playing, audio, volume]);

  useEffect(() => {
    if (!audio) return;
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, [audio]);

  return [playing, toggle, audio];
};

export default useAudio;
