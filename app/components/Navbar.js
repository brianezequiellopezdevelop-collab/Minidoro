"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Temporizador" },
  { href: "/tareas", label: "Tareas" },
  { href: "/estadisticas", label: "Estadísticas" },
  { href: "/configuracion", label: "Configuración" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  return (
    <nav className="border-b border-white/10 px-4 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <span className="text-red-500 font-bold text-lg tracking-widest uppercase">
          DEVIATAN_
        </span>

        {/* Links — desktop */}
        <div className="hidden md:flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "text-white font-semibold"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Botón hamburguesa — mobile */}
        <button
          onClick={() => setAbierto(!abierto)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span
            className={`block w-5 h-0.5 bg-white/70 transition-all duration-300 ${abierto ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-white/70 transition-all duration-300 ${abierto ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-white/70 transition-all duration-300 ${abierto ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Menú mobile desplegable */}
      {abierto && (
        <div className="md:hidden mt-4 flex flex-col gap-1 max-w-4xl mx-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setAbierto(false)}
              className={`px-4 py-3 rounded-xl text-sm transition-colors ${
                pathname === link.href
                  ? "bg-white/10 text-white font-semibold"
                  : "text-white/40 hover:bg-white/5 hover:text-white/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
