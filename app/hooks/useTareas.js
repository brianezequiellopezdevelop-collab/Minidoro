"use client";

import { useState, useEffect } from "react";
import tareasIniciales from "../data/tareas.json";

export function useTareas() {
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    const guardadas = localStorage.getItem("tareas");
    if (guardadas) {
      setTareas(JSON.parse(guardadas));
    } else {
      setTareas(tareasIniciales);
    }
  }, []);

  useEffect(() => {
    if (tareas.length > 0) {
      localStorage.setItem("tareas", JSON.stringify(tareas));
    }
  }, [tareas]);

  return { tareas, setTareas };
}
