import { CheckInPanel } from "@/components/CheckInPanel";
import { GameCanvas } from "@/components/GameCanvas";
import { WalletBar } from "@/components/WalletBar";

export default function Home() {
  return (
    <main className="flex h-dvh max-h-dvh flex-col overflow-x-hidden">
      <header className="relative z-30 flex shrink-0 items-start justify-between gap-2 border-b border-cyan-500/20 bg-[#050508]/90 px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-md">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-fuchsia-400 animate-neon-pulse">
            Base App
          </p>
          <h1 className="font-mono text-sm font-bold text-cyan-200">
            Neon Flappy
          </h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <CheckInPanel />
          <WalletBar />
        </div>
      </header>

      <GameCanvas />
    </main>
  );
}
