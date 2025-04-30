import { MCPServer } from "@anthropic/mcp-server";
import { ethers } from "ethers";
import { z } from "zod";
import { MONAD_TESTNET } from "./config.mjs";

// Monad Testnet provider 설정
const provider = new ethers.JsonRpcProvider(MONAD_TESTNET.RPC_URL);

// MCP 서버 인스턴스 생성
const server = new MCPServer({
  name: "monad-quick-fortune",
  version: "1.0.0",
  capabilities: ["get-mon-balance", "get-block-info"],
});

// MON 잔액 조회 도구 정의
server.tool(
  "get-mon-balance",
  "Get MON balance for an address on Monad testnet",
  {
    address: z.string().describe("Monad testnet address to check balance for"),
  },
  async ({ address }) => {
    try {
      const balance = await provider.getBalance(address);
      return {
        content: [
          {
            type: "text",
            text: `Balance for ${address}: ${ethers.formatEther(balance)} MON`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve balance for address: ${address}. Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  }
);

// 블록 정보 조회 도구 정의
server.tool(
  "get-block-info",
  "Get latest block information from Monad testnet",
  {},
  async () => {
    try {
      const blockNumber = await provider.getBlockNumber();
      const block = await provider.getBlock(blockNumber);

      return {
        content: [
          {
            type: "text",
            text: `Latest Block Info:
- Block Number: ${blockNumber}
- Timestamp: ${new Date(block.timestamp * 1000).toISOString()}
- Transactions: ${block.transactions.length}
- Gas Used: ${block.gasUsed.toString()}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve block information. Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  }
);

// 서버 시작
server.start();
