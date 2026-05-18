import { Attribution } from "ox/erc8021";
import type { Hex } from "viem";

/** From base.dev → Settings → Builder Codes */
export const PRODUCTION_BUILDER_CODE = "bc_ghc4y6ow";

const BUILDER_CODE =
  process.env.NEXT_PUBLIC_BUILDER_CODE?.trim() || PRODUCTION_BUILDER_CODE;

const OVERRIDE_SUFFIX = process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX?.trim();

/**
 * ERC-8021 data suffix for onchain attribution.
 * @see https://docs.base.org/apps/builder-codes/app-developers
 */
export function getBuilderDataSuffix(): Hex {
  if (OVERRIDE_SUFFIX) return OVERRIDE_SUFFIX as Hex;

  return Attribution.toDataSuffix({
    codes: [BUILDER_CODE],
  }) as Hex;
}
