"use client";

import { createConfig, createStorage, cookieStorage, http } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { baseAccount } from "wagmi/connectors";
import { getBuilderDataSuffix } from "@/lib/builder/attribution";

/** Appends bc_* builder code to all wagmi transactions (ERC-8021). */
const dataSuffix = getBuilderDataSuffix();

export const config = createConfig({
  chains: [base, mainnet],
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
  dataSuffix,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
