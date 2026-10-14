import { createRiverReader } from "./prefectura";

const shared = globalThis as typeof globalThis & { islaPuenteRiver?: ReturnType<typeof createRiverReader> };
export const getRiver = shared.islaPuenteRiver ??= createRiverReader();
