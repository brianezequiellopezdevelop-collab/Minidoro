"use client";

import { useState } from "react";
import { useTareas } from "../hooks/useTareas";

export default function Tareas() {
  const { tareas, setTareas } = useTareas();
  const [titulo, setTitulo] = useState("");
  const [objetivo, setObjetivo] = useState(4);

  const colores = [
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#f97316",
    "#a855f7",
    "#eab308",
  ];
  const [colorSeleccionado, setColorSeleccionado] = useState(colores[0]);

  function agregarTarea() {
    if (titulo === "") return;
    const nueva = {
      id: Date.now(),
      titulo,
      pomodorosObjetivo: objetivo,
      pomodorosCompletados: 0,
      color: colorSeleccionado,
    };
    setTareas([...tareas, nueva]);
    setTitulo("");
    setObjetivo(4);
  }

  function eliminarTarea(id) {
    setTareas(tareas.filter((t) => t.id !== id));
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-8">Tareas</h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 flex flex-col gap-4">
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Nombre de la tarea..."
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-white/30 text-white placeholder-white/30"
        />

        <div className="flex items-center justify-between">
          <span className="text-sm text-white/40">Pomodoros objetivo</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setObjetivo(Math.max(1, objetivo - 1))}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              −
            </button>
            <span className="text-sm w-4 text-center">{objetivo}</span>
            <button
              onClick={() => setObjetivo(objetivo + 1)}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-white/40">Color</span>
          <div className="flex gap-2">
            {colores.map((color) => (
              <button
                key={color}
                onClick={() => setColorSeleccionado(color)}
                className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                style={{
                  backgroundColor: color,
                  outline:
                    colorSeleccionado === color ? "2px solid white" : "none",
                  outlineOffset: "2px",
                }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={agregarTarea}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
        >
          Agregar tarea
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {tareas.map((tarea) => {
          const porcentaje = Math.min(
            Math.round(
              (tarea.pomodorosCompletados / tarea.pomodorosObjetivo) * 100,
            ),
            100,
          );
          return (
            <div
              key={tarea.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tarea.color }}
                  />
                  <span className="text-sm font-medium">{tarea.titulo}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/40">
                    {tarea.pomodorosCompletados}/{tarea.pomodorosObjetivo}
                  </span>
                  <button
                    onClick={() => eliminarTarea(tarea.id)}
                    className="text-white/20 hover:text-red-400 text-xs transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1">
                <div
                  className="h-1 rounded-full transition-all"
                  style={{
                    width: `${porcentaje}%`,
                    backgroundColor: tarea.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
