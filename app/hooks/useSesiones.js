"use client";

import { useState, useEffect } from "react";
import sesionesIniciales from "../data/sesiones.json";

export function useSesiones() {
  const [sesiones, setSesiones] = useState([]);

  useEffect(() => {
    const guardadas = localStorage.getItem("sesiones");
    if (guardadas) {
      setSesiones(JSON.parse(guardadas));
    } else {
      setSesiones(sesionesIniciales);
    }
  }, []);

  useEffect(() => {
    if (sesiones.length > 0) {
      localStorage.setItem("sesiones", JSON.stringify(sesiones));
    }
  }, [sesiones]);

  return { sesiones, setSesiones };
}
