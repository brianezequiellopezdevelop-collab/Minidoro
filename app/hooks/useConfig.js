"use client";

import { useState, useEffect } from "react";

const CONFIG_DEFAULT = {
  pomodoro: 25,
  descansoCorto: 5,
  descansoLargo: 15,
};

export function useConfig() {
  const [config, setConfig] = useState(CONFIG_DEFAULT);

  useEffect(() => {
    const guardada = localStorage.getItem("config");
    if (guardada) setConfig(JSON.parse(guardada));
  }, []);

  useEffect(() => {
    function handleActualizacion() {
      const guardada = localStorage.getItem("config");
      if (guardada) setConfig(JSON.parse(guardada));
    }
    window.addEventListener("configActualizada", handleActualizacion);
    return () =>
      window.removeEventListener("configActualizada", handleActualizacion);
  }, []);

  return { config, setConfig };
}
