"use client";

import { createConfig, createStorage, cookieStorage, http } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { baseAccount } from "wagmi/connectors";
import { getBuilderDataSuffix } from "@/lib/builder/attribution";

const dataSuffix = getBuilderDataSuffix();

export const config = createConfig({
  chains: [base, mainnet],
  // Avoid legacy window.ethereum shim — it conflicts when multiple wallet
  // extensions fight over the property. EIP-6963 discovery still lists MetaMask,
  // Rabby, etc. automatically (multiInjectedProviderDiscovery defaults to true).
  connectors: [
    baseAccount({
      appName: "Neon Flappy",
    }),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
  ...(dataSuffix ? { dataSuffix } : {}),
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
