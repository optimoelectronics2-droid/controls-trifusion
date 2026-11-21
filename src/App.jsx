import { useEffect, useState } from "react";

const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxy0lJr54UaT2KrCYC2rbxEX8z4oh_MdoCcUASPeShYDKE4eB9cH939dB55rqhoC4gEHg/exec?app=1";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0A0A0F]/90 px-4 py-3 backdrop-blur">
        <h1 className="font-display text-xl font-black sm:text-2xl">Sistema de Control Móvil</h1>
        <a href={APP_SCRIPT_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-600">Abrir Apps Script</a>
      </div>
      <div className="relative min-h-[100dvh] pt-14">
        {!loaded && <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0F]/80"><p className="text-sm text-white/70">Cargando el sistema de CONTROL...</p></div>}
        <iframe
          src={APP_SCRIPT_URL}
          title="Sistema de Control Móvil"
          className="h-screen w-full border-0"
          loading="eager"
          referrerPolicy="no-referrer"
          allow="autoplay; clipboard-write; fullscreen"
        />
      </div>
    </main>
  );
}
