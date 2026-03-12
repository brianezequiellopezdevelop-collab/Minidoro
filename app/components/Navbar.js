"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Temporizador" },
  { href: "/tareas", label: "Tareas" },
  { href: "/estadisticas", label: "Estadísticas" },
  { href: "/configuracion", label: "Configuración" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-white/10 px-4 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <span className="text-red-500 font-bold text-lg tracking-widest uppercase">
          Deviatan_
        </span>
        <div className="flex gap-6">
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
      </div>
    </nav>
  );
}
