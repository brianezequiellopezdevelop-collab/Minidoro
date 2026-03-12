"use client";

import { useState } from "react";
import { useConfig } from "../hooks/useConfig";

export default function Configuracion() {
  const { config, setConfig } = useConfig();
  const [guardado, setGuardado] = useState(false);

  function actualizar(clave, valor) {
    const num = Math.max(1, Math.min(99, Number(valor)));
    setConfig((prev) => ({ ...prev, [clave]: num }));
  }

  function guardar() {
    localStorage.setItem("config", JSON.stringify(config));
    window.dispatchEvent(new Event("configActualizada"));
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  }

  const campos = [
    {
      clave: "pomodoro",
      label: "Pomodoro",
      descripcion: "Duración de cada sesión de trabajo",
    },
    {
      clave: "descansoCorto",
      label: "Descanso corto",
      descripcion: "Pausa entre pomodoros",
    },
    {
      clave: "descansoLargo",
      label: "Descanso largo",
      descripcion: "Pausa cada 4 pomodoros",
    },
  ];

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">Configuración</h1>
      <p className="text-white/40 text-sm mb-8">
        Personalizá los tiempos del temporizador
      </p>

      <div className="flex flex-col gap-4 mb-8">
        {campos.map(({ clave, label, descripcion }) => (
          <div
            key={clave}
            className="bg-white/5 border border-white/10 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-white/40 mt-0.5">{descripcion}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => actualizar(clave, config[clave] - 1)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  −
                </button>
                <div className="flex items-center gap-1 w-16 justify-center">
                  <input
                    type="number"
                    value={config[clave]}
                    onChange={(e) => actualizar(clave, e.target.value)}
                    className="w-10 bg-transparent text-center text-sm outline-none text-white"
                  />
                  <span className="text-white/40 text-xs">min</span>
                </div>
                <button
                  onClick={() => actualizar(clave, config[clave] + 1)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={guardar}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
          guardado
            ? "bg-red-800 text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
      >
        {guardado ? "✓ Guardado" : "Guardar cambios"}
      </button>

      <p className="text-white/20 text-xs text-center mt-4">
        Los cambios se aplican al reiniciar el temporizador
      </p>
    </div>
  );
}
