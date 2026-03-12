"use client";

import { useState } from "react";
import { useSesiones } from "../hooks/useSesiones";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function Estadisticas() {
  const { sesiones } = useSesiones();
  const [vista, setVista] = useState("dias");

  function obtenerDatosDias() {
    const hoy = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - (6 - i));
      const fechaStr = fecha.toISOString().split("T")[0];
      const count = sesiones.filter((s) => s.fecha === fechaStr).length;
      const label = fecha.toLocaleDateString("es-AR", { weekday: "short" });
      return { nombre: label, pomodoros: count };
    });
  }

  function obtenerDatosSemanas() {
    return Array.from({ length: 8 }, (_, i) => {
      const finSemana = new Date();
      finSemana.setDate(finSemana.getDate() - i * 7);
      const inicioSemana = new Date(finSemana);
      inicioSemana.setDate(finSemana.getDate() - 6);

      const count = sesiones.filter((s) => {
        const fecha = new Date(s.fecha);
        return fecha >= inicioSemana && fecha <= finSemana;
      }).length;

      return {
        nombre: `S${8 - i}`,
        pomodoros: count,
        detalle: `${inicioSemana.toLocaleDateString("es-AR", { day: "numeric", month: "short" })} - ${finSemana.toLocaleDateString("es-AR", { day: "numeric", month: "short" })}`,
      };
    }).reverse();
  }

  function obtenerDatosMeses() {
    const meses = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const hoy = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - (5 - i), 1);
      const año = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const count = sesiones.filter((s) =>
        s.fecha.startsWith(`${año}-${mes}`),
      ).length;
      return { nombre: meses[fecha.getMonth()], pomodoros: count };
    });
  }

  function obtenerDatosAnios() {
    const hoyAnio = new Date().getFullYear();
    return Array.from({ length: 4 }, (_, i) => {
      const año = hoyAnio - (3 - i);
      const count = sesiones.filter((s) => s.fecha.startsWith(`${año}`)).length;
      return { nombre: String(año), pomodoros: count };
    });
  }

  function obtenerDatos() {
    if (vista === "dias") return obtenerDatosDias();
    if (vista === "semanas") return obtenerDatosSemanas();
    if (vista === "meses") return obtenerDatosMeses();
    if (vista === "anios") return obtenerDatosAnios();
    return [];
  }

  const datos = obtenerDatos();
  const totalSesiones = sesiones.length;
  const totalMinutos = sesiones.length * 25;
  const totalHoras = Math.floor(totalMinutos / 60);
  const minutosResto = totalMinutos % 60;

  const tareaTop = sesiones.reduce((acc, s) => {
    acc[s.titulo] = (acc[s.titulo] || 0) + 1;
    return acc;
  }, {});
  const tareaTopNombre =
    Object.entries(tareaTop).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  const vistas = [
    { key: "dias", label: "Días" },
    { key: "semanas", label: "Semanas" },
    { key: "meses", label: "Meses" },
    { key: "anios", label: "Años" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Estadísticas</h1>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/40 text-xs mb-1">Total pomodoros</p>
          <p className="text-2xl font-bold">{totalSesiones}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/40 text-xs mb-1">Tiempo total</p>
          <p className="text-2xl font-bold">
            {totalHoras}h {minutosResto}m
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/40 text-xs mb-1">Tarea top</p>
          <p className="text-lg font-bold truncate">{tareaTopNombre}</p>
        </div>
      </div>

      {/* Selector de vista */}
      <div className="flex gap-2 bg-white/5 rounded-xl p-1 mb-6 w-fit">
        {vistas.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setVista(key)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              vista === key
                ? "bg-red-500 text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Gráfico */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={datos} barSize={vista === "dias" ? 28 : 20}>
            <XAxis
              dataKey="nombre"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "white",
                fontSize: "12px",
              }}
              labelStyle={{ color: "rgba(255,255,255,0.5)" }}
              itemStyle={{ color: "white" }}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              formatter={(value, name, props) => [
                `${value} pomodoros`,
                props.payload.detalle || props.payload.nombre,
              ]}
            />
            <Bar dataKey="pomodoros" radius={[4, 4, 0, 0]}>
              {datos.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.pomodoros > 0 ? "#ef4444" : "rgba(255,255,255,0.1)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
