"use client";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { useTareas } from "./hooks/useTareas";
import { useSesiones } from "./hooks/useSesiones";
import { useConfig } from "./hooks/useConfig";
import { useAudio } from "./hooks/useAudio";

export default function Home() {
  const { tareas, setTareas } = useTareas();
  const { setSesiones } = useSesiones();
  const { config } = useConfig();
  const { reproducir } = useAudio();
  const [modo, setModo] = useState("pomodoro");
  const [segundos, setSegundos] = useState(25 * 60);
  const [corriendo, setCorriendo] = useState(false);
  const [tareaActiva, setTareaActiva] = useState(null);
  const [notaTitulo, setNotaTitulo] = useState("");
  const [notaTexto, setNotaTexto] = useState("");
  const intervaloRef = useRef(null);
  const tareaActivaRef = useRef(null);
  const configRef = useRef(config);
  const [pomodorosEnRacha, setPomodorosEnRacha] = useState(0);

  // Mantener configRef actualizado
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const MODOS = {
    pomodoro: { label: "Pomodoro", duracion: (config.pomodoro || 25) * 60 },
    descansoCorto: {
      label: "Descanso corto",
      duracion: (config.descansoCorto || 5) * 60,
    },
    descansoLargo: {
      label: "Descanso largo",
      duracion: (config.descansoLargo || 15) * 60,
    },
  };

  useEffect(() => {
    const guardada = localStorage.getItem("nota");
    if (guardada) {
      const { titulo, texto } = JSON.parse(guardada);
      setNotaTitulo(titulo);
      setNotaTexto(texto);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "nota",
      JSON.stringify({ titulo: notaTitulo, texto: notaTexto }),
    );
  }, [notaTitulo, notaTexto]);

  useEffect(() => {
    pausar();
    setSegundos((config[modo] || 25) * 60);
  }, [modo]);

  useEffect(() => {
    pausar();
    setSegundos((config[modo] || 25) * 60);
  }, [config]);

  useEffect(() => {
    if (corriendo) {
      intervaloRef.current = setInterval(() => {
        setSegundos((s) => {
          if (s <= 1) return 0;
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervaloRef.current);
  }, [corriendo]);

  useEffect(() => {
    if (segundos === 0) {
      pausar();
      if (modo === "pomodoro") {
        completarPomodoro();
      } else {
        reproducir("descanso", configRef.current.volumen || 80);
      }
    }
  }, [segundos]);

  useEffect(() => {
    tareaActivaRef.current = tareaActiva;
  }, [tareaActiva]);

  useEffect(() => {
    const modoLabel = MODOS[modo]?.label || "Pomodoro";
    document.title = `${modoLabel} - ${formatearTiempo(segundos)} | DEVIATAN_`;
  }, [segundos, modo]);

  function completarPomodoro() {
    const tarea = tareaActivaRef.current;
    const volumen = configRef.current.volumen || 80;
    reproducir("pomodoro", volumen);

    const nuevaRacha = pomodorosEnRacha + 1;
    setPomodorosEnRacha(nuevaRacha);

    if (nuevaRacha % 4 === 0) {
      setModo("descansoLargo");
    } else {
      setModo("descansoCorto");
    }

    if (!tarea) return;
    setTareas((prev) =>
      prev.map((t) => {
        if (t.id === tarea.id) {
          return { ...t, pomodorosCompletados: t.pomodorosCompletados + 1 };
        }
        return t;
      }),
    );
    const nuevaSesion = {
      id: Date.now(),
      tareaId: tarea.id,
      titulo: tarea.titulo,
      color: tarea.color,
      fecha: new Date().toISOString().split("T")[0],
      duracion: configRef.current.pomodoro || 25,
    };
    setSesiones((prev) => [...prev, nuevaSesion]);
  }

  function pausar() {
    setCorriendo(false);
    clearInterval(intervaloRef.current);
  }

  function resetear() {
    pausar();
    setSegundos((config[modo] || 25) * 60);
  }

  function formatearTiempo(s) {
    const minutos = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const segs = (s % 60).toString().padStart(2, "0");
    return `${minutos}:${segs}`;
  }

  const progreso = 1 - segundos / MODOS[modo].duracion;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start mt-10">
      {/* Columna izquierda — Timer */}
      <div className="flex flex-col items-center gap-8 flex-1">
        {/* Selector de modo */}
        <div className="flex gap-2 bg-white/5 rounded-xl p-1">
          {Object.entries(MODOS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setModo(key)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                modo === key
                  ? "bg-red-500 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* Círculo con timer */}
        <div className="relative flex items-center justify-center w-64 h-64">
          <svg
            className="absolute w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeOpacity="0.05"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#ef4444"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progreso)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <span className="text-6xl font-thin tracking-widest">
            {formatearTiempo(segundos)}
          </span>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            onClick={resetear}
            className="px-6 py-3 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            Resetear
          </button>
          <button
            onClick={() => setCorriendo(!corriendo)}
            className="px-10 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
          >
            {corriendo ? "Pausar" : "Iniciar"}
          </button>
        </div>

        {/* Selector de tarea activa */}
        <div className="w-full max-w-sm">
          <p className="text-white/40 text-sm mb-3">Trabajando en:</p>
          <div className="flex flex-col gap-2">
            {tareas.map((tarea) => (
              <button
                key={tarea.id}
                onClick={() =>
                  setTareaActiva(tarea.id === tareaActiva?.id ? null : tarea)
                }
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                  tareaActiva?.id === tarea.id
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tarea.color }}
                  />
                  <span className="text-sm">{tarea.titulo}</span>
                </div>
                <span className="text-sm text-white/40">
                  {tarea.pomodorosCompletados}/{tarea.pomodorosObjetivo}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Columna derecha — Nota */}
      <aside className="hidden lg:flex w-72 bg-white/5 border border-white/10 rounded-2xl p-5 flex-col gap-4 sticky top-8">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="text-xs text-white/40 uppercase tracking-widest">
            Nota de sesión
          </span>
        </div>

        <input
          type="text"
          value={notaTitulo}
          onChange={(e) => setNotaTitulo(e.target.value)}
          placeholder="Título..."
          className="bg-transparent border-b border-white/10 pb-2 text-sm font-medium outline-none text-white placeholder-white/20 focus:border-white/30 transition-colors"
        />

        <textarea
          value={notaTexto}
          onChange={(e) => setNotaTexto(e.target.value)}
          placeholder="¿En qué te vas a enfocar este pomodoro?&#10;&#10;— Terminar la función X&#10;— Revisar el ejercicio 3&#10;— No distraerse con..."
          rows={10}
          className="bg-transparent text-sm text-white/70 placeholder-white/20 outline-none resize-none leading-relaxed"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-white/20">
            {notaTexto.length} caracteres
          </span>
          <button
            onClick={() => {
              setNotaTitulo("");
              setNotaTexto("");
            }}
            className="text-xs text-white/20 hover:text-red-400 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </aside>
    </div>
  );
}
