"use client";

import {
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { base } from "wagmi/chains";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function WalletBar() {
  const [mounted, setMounted] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { address, isConnected, chainId } = useConnection();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const connectors = useConnectors();

  const wrongNetwork = isConnected && chainId !== base.id;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheetOpen]);

  const shortAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : "";

  const handleConnect = useCallback(
    (connectorId: string) => {
      const connector = connectors.find((c) => c.id === connectorId);
      if (!connector) return;
      connect({ connector, chainId: base.id });
      setSheetOpen(false);
    },
    [connect, connectors],
  );

  const sheet =
    sheetOpen && mounted ? (
      <>
        <div
          className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
          aria-hidden
          onClick={() => setSheetOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Connect wallet"
          className="fixed inset-x-0 bottom-0 z-[9999] rounded-t-2xl border border-cyan-500/30 bg-[#0a0614]/95 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-8px_40px_rgba(0,245,255,0.15)]"
        >
          <button
            type="button"
            aria-label="Close wallet sheet"
            onClick={() => setSheetOpen(false)}
            className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-300"
          >
            ✕
          </button>
          <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/80">
            Select Wallet
          </p>
          <div className="mb-[env(safe-area-inset-bottom)] max-h-[50vh] space-y-2 overflow-y-auto">
            {[...connectors].map((connector) => (
              <button
                key={connector.id}
                type="button"
                disabled={isPending}
                onClick={() => handleConnect(connector.id)}
                className="w-full rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-4 py-3 text-left font-mono text-sm text-cyan-100 transition hover:border-fuchsia-400/50 hover:bg-fuchsia-950/30 disabled:opacity-50"
              >
                {connector.name}
              </button>
            ))}
          </div>
        </div>
      </>
    ) : null;

  return (
    <div className="flex shrink-0 flex-col gap-2">
      {wrongNetwork && (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-amber-500/40 bg-amber-950/30 px-3 py-2">
          <span className="text-xs font-mono text-amber-200">Wrong Network</span>
          <button
            type="button"
            disabled={isSwitching}
            onClick={() => switchChain({ chainId: base.id })}
            className="rounded-lg border border-amber-400/50 bg-amber-950/50 px-3 py-1 text-xs font-mono text-amber-100"
          >
            Switch to Base
          </button>
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        {isConnected ? (
          <>
            <span className="font-mono text-xs text-cyan-300/90">
              {shortAddress}
            </span>
            <button
              type="button"
              onClick={() => disconnect()}
              className="rounded-lg border border-zinc-600/50 px-3 py-1.5 text-xs font-mono text-zinc-300"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="neon-btn rounded-lg px-4 py-1.5 text-xs font-mono uppercase tracking-wider"
          >
            Connect Wallet
          </button>
        )}
      </div>
      {mounted && sheet && createPortal(sheet, document.body)}
    </div>
  );
}
