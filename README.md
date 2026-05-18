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

Copy `.env.example` to `web/.env.local` and adjust if needed.

**Production:** https://flappy-bird-sigma-three.vercel.app

## Base.dev setup

1. App on [base.dev](https://base.dev) / [dashboard.base.org](https://dashboard.base.org).
2. **App ID** `6a0aaea01f1ccae4c221e8d0` → `NEXT_PUBLIC_BASE_APP_ID` (also `<meta name="base:app_id" />` in layout).
3. **Builder Code** `bc_ghc4y6ow` → `NEXT_PUBLIC_BUILDER_CODE` (wagmi `dataSuffix` via `ox` / ERC-8021).
4. `CheckIn.sol` on Base mainnet: `0x9f133Cf344f8FC078882d3ce9B7C425Ae2695BB8`.

## Deploy contract

```bash
cd contracts
forge script script/DeployCheckIn.s.sol:DeployCheckIn --rpc-url $BASE_RPC_URL --broadcast
```

## Vercel

- Root Directory: `web`
- Production URL: `https://flappy-bird-sigma-three.vercel.app`
- Add all `NEXT_PUBLIC_*` env vars from `.env.example` (especially `NEXT_PUBLIC_BASE_APP_ID` and `NEXT_PUBLIC_SITE_URL`).

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
