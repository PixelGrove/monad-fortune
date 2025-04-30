export const MONAD_TESTNET = {
  RPC_URL: "https://testnet-rpc.monad.xyz",
  CHAIN_ID: 1234,
  EXPLORER_URL: "https://testnet-explorer.monad.xyz",
} as const;

export const MCP_CONFIG = {
  name: "monad-quick-fortune",
  version: "1.0.0",
  capabilities: [
    "get-mon-balance",
    "get-block-info",
    "get-transaction",
  ] as const,
} as const;
