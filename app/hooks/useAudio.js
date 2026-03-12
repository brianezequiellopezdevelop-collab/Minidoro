"use client";

import { useRef } from "react";

const SONIDOS = {
  pomodoro: "https://cdn.freesound.org/previews/411/411089_5121236-lq.mp3",
  descanso: "https://cdn.freesound.org/previews/156/156031_2538033-lq.mp3",
};

export function useAudio(volumen = 80) {
  const audioRef = useRef(null);

  function reproducir(tipo) {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(SONIDOS[tipo]);
    audio.volume = volumen / 100;
    audio.play().catch(() => {});
    audioRef.current = audio;
  }

  return { reproducir };
}
