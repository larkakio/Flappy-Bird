import { Attribution } from "ox/erc8021";
import type { Hex } from "viem";

const BUILDER_CODE =
  process.env.NEXT_PUBLIC_BUILDER_CODE?.trim() || "bc_placeholder";

const OVERRIDE_SUFFIX = process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX?.trim();

export function getBuilderDataSuffix(): Hex | undefined {
  if (OVERRIDE_SUFFIX) return OVERRIDE_SUFFIX as Hex;
  if (!BUILDER_CODE || BUILDER_CODE === "bc_placeholder") return undefined;
  try {
    return Attribution.toDataSuffix({
      codes: [BUILDER_CODE],
    }) as Hex;
  } catch {
    return undefined;
  }
}
