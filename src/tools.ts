import { ethers } from "ethers";
import { MONAD_TESTNET } from "./config.js";
import type {
  GetBalanceInput,
  GetBlockInfoInput,
  GetTransactionInput,
  MCPResponse,
} from "./types.js";

// Monad Testnet provider 설정
const provider = new ethers.JsonRpcProvider(MONAD_TESTNET.RPC_URL);

export async function getMonBalance({
  address,
}: GetBalanceInput): Promise<MCPResponse> {
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

export async function getBlockInfo({}: GetBlockInfoInput): Promise<MCPResponse> {
  try {
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);

    return {
      content: [
        {
          type: "text",
          text: `Latest Block Info:
- Block Number: ${blockNumber}
- Timestamp: ${new Date(Number(block?.timestamp) * 1000).toISOString()}
- Transactions: ${block?.transactions.length}
- Gas Used: ${block?.gasUsed.toString()}`,
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

export async function getTransaction({
  hash,
}: GetTransactionInput): Promise<MCPResponse> {
  try {
    const tx = await provider.getTransaction(hash);
    if (!tx) {
      return {
        content: [
          {
            type: "text",
            text: `Transaction not found: ${hash}`,
          },
        ],
      };
    }

    const receipt = await provider.getTransactionReceipt(hash);

    return {
      content: [
        {
          type: "text",
          text: `Transaction Info:
- Hash: ${tx.hash}
- From: ${tx.from}
- To: ${tx.to}
- Value: ${ethers.formatEther(tx.value)} MON
- Gas Price: ${ethers.formatUnits(tx.gasPrice, "gwei")} Gwei
- Gas Limit: ${tx.gasLimit.toString()}
- Nonce: ${tx.nonce}
- Status: ${receipt?.status === 1 ? "Success" : "Failed"}
- Block Number: ${tx.blockNumber}
- Confirmations: ${tx.confirmations}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Failed to retrieve transaction information. Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
    };
  }
}
