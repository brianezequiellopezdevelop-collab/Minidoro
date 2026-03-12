import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Pomodoro App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
