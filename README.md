# Neon Flappy — Base Standard Web App

Cyberpunk Flappy Bird for mobile and the Base App in-app browser. English UI, swipe-up controls, multi-sector campaign, daily on-chain check-in on Base (gas only), and ERC-8021 builder attribution.

## Stack

- **web/** — Next.js App Router, TypeScript, Tailwind, Canvas game
- **contracts/** — Foundry `CheckIn.sol` (one check-in per UTC day, `msg.value` must be 0)
- **wagmi + viem** — wallet, Base mainnet, builder `dataSuffix` via `ox`

No Farcaster mini-app SDK. No push notifications.

## Quick start

```bash
cd web && npm install && npm run dev
```

```bash
cd contracts && forge test
```

Copy `.env.example` to `web/.env.local` and fill in values after [base.dev](https://base.dev) registration.

## Base.dev setup

1. Create a project at [base.dev](https://base.dev).
2. Set **App ID** → `NEXT_PUBLIC_BASE_APP_ID` (also emitted as `<meta name="base:app_id" />` in layout).
3. Copy **Builder Code** (`bc_…`) → `NEXT_PUBLIC_BUILDER_CODE`.
4. `CheckIn.sol` on Base mainnet: `0x9f133Cf344f8FC078882d3ce9B7C425Ae2695BB8` (set in `web/.env.local` as `NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS`).

## Deploy contract

```bash
cd contracts
forge script script/DeployCheckIn.s.sol:DeployCheckIn --rpc-url $BASE_RPC_URL --broadcast
```

## Vercel

- Root Directory: `web`
- Add all `NEXT_PUBLIC_*` env vars from `.env.example`.

## Game controls

- **Swipe up** on the playfield to thrust (primary).
- Tap or Space also flaps.
- Clear each sector by passing the gate target (Sector 1: 5 gates → Sector 2 unlocks).

## Builder codes

Attribution uses `Attribution.toDataSuffix` from `ox/erc8021` on check-in transactions. The Base App also auto-appends your code for in-app users once registered.

Verify: [builder-code-checker](https://builder-code-checker.vercel.app/)

## Assets

- `web/public/app-icon.jpg` — 1024×1024, &lt;1MB
- `web/public/app-thumbnail.jpg` — 1.91:1, &lt;1MB
