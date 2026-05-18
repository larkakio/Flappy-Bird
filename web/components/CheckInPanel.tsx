"use client";

import { getBuilderDataSuffix } from "@/lib/builder/attribution";
import { checkInAbi } from "@/lib/contracts/checkInAbi";
import { base } from "wagmi/chains";
import {
  useConnection,
  useReadContract,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { useCallback, useState } from "react";

const CONTRACT = process.env.NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS as
  | `0x${string}`
  | undefined;

export function CheckInPanel() {
  const { address, isConnected, chainId } = useConnection();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { writeContractAsync, isPending: isWriting } = useWriteContract();
  const [message, setMessage] = useState<string | null>(null);

  const { data: canCheckIn, refetch } = useReadContract({
    address: CONTRACT,
    abi: checkInAbi,
    functionName: "canCheckIn",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(isConnected && address && CONTRACT) },
  });

  const { data: streak } = useReadContract({
    address: CONTRACT,
    abi: checkInAbi,
    functionName: "streak",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(isConnected && address && CONTRACT) },
  });

  const handleSync = useCallback(async () => {
    if (!isConnected || !address) {
      setMessage("Connect wallet first");
      return;
    }
    if (!CONTRACT) {
      setMessage("Contract not configured");
      return;
    }

    setMessage(null);
    try {
      const baseId = base.id;
      if (chainId !== baseId) {
        await switchChainAsync({ chainId: baseId });
      }

      await writeContractAsync({
        address: CONTRACT,
        abi: checkInAbi,
        functionName: "checkIn",
        chainId: baseId,
        dataSuffix: getBuilderDataSuffix(),
      });

      setMessage("Daily sync complete");
      await refetch();
    } catch (err) {
      const text =
        err instanceof Error ? err.message.slice(0, 80) : "Sync failed";
      setMessage(text);
    }
  }, [
    address,
    chainId,
    isConnected,
    refetch,
    switchChainAsync,
    writeContractAsync,
  ]);

  if (!isConnected) return null;

  const disabled =
    !CONTRACT ||
    isWriting ||
    isSwitching ||
    canCheckIn === false;

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={disabled}
        onClick={handleSync}
        className="neon-btn rounded-lg px-3 py-1.5 text-xs font-mono uppercase tracking-wider disabled:opacity-40"
      >
        {isWriting || isSwitching ? "Syncing…" : "Daily Sync"}
      </button>
      {streak !== undefined && (
        <span className="font-mono text-[10px] text-fuchsia-300/70">
          Streak {String(streak)}
        </span>
      )}
      {message && (
        <span className="max-w-[140px] truncate font-mono text-[10px] text-cyan-300/80">
          {message}
        </span>
      )}
    </div>
  );
}
