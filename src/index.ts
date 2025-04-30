#!/usr/bin/env node
import { MCP_CONFIG } from "./config.js";
import {
  GetBalanceSchema,
  GetBlockInfoSchema,
  GetTransactionSchema,
} from "./types.js";
import { getMonBalance, getBlockInfo, getTransaction } from "./tools.js";
import { logger } from "./logger.js";

// MCP 메시지 처리
process.stdin.setEncoding("utf8");

let buffer = "";

process.stdin.on("data", (chunk) => {
  buffer += chunk;

  // 완전한 JSON 메시지를 찾아 처리
  const messages = buffer.split("\n");
  buffer = messages.pop() || "";

  for (const message of messages) {
    if (!message.trim()) continue;

    try {
      const request = JSON.parse(message);
      logger.info({ request }, "Received request");
      handleRequest(request);
    } catch (error) {
      logger.error({ error, message }, "Error parsing message");
    }
  }
});

async function handleRequest(request: any) {
  const { jsonrpc, method, params, id } = request;

  // JSON-RPC 2.0 검증
  if (jsonrpc !== "2.0") {
    sendError(id, -32600, "Invalid Request: Only JSON-RPC 2.0 is supported");
    return;
  }

  try {
    switch (method) {
      case "server/info": {
        logger.info("Handling server/info request");
        sendResponse(id, {
          name: MCP_CONFIG.name,
          version: MCP_CONFIG.version,
          capabilities: MCP_CONFIG.capabilities,
          vendor: {
            name: "Monad Testnet MCP Server",
            url: "https://monad.xyz",
          },
        });
        break;
      }

      case "tools/list": {
        logger.info("Handling tools/list request");
        sendResponse(id, {
          tools: [
            {
              name: "get-mon-balance",
              description: "Get MON balance for an address on Monad testnet",
              parameters: GetBalanceSchema.shape,
              returns: {
                type: "object",
                properties: {
                  content: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["text"] },
                        text: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
            {
              name: "get-block-info",
              description: "Get latest block information from Monad testnet",
              parameters: GetBlockInfoSchema.shape,
              returns: {
                type: "object",
                properties: {
                  content: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["text"] },
                        text: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
            {
              name: "get-transaction",
              description: "Get transaction information from Monad testnet",
              parameters: GetTransactionSchema.shape,
              returns: {
                type: "object",
                properties: {
                  content: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["text"] },
                        text: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          ],
        });
        break;
      }

      case "tools/call": {
        const { tool, args } = params;
        logger.info({ tool, args }, "Handling tools/call request");

        switch (tool) {
          case "get-mon-balance": {
            const validatedArgs = GetBalanceSchema.parse(args);
            const result = await getMonBalance(validatedArgs);
            sendResponse(id, result);
            break;
          }

          case "get-block-info": {
            const validatedArgs = GetBlockInfoSchema.parse(args);
            const result = await getBlockInfo(validatedArgs);
            sendResponse(id, result);
            break;
          }

          case "get-transaction": {
            const validatedArgs = GetTransactionSchema.parse(args);
            const result = await getTransaction(validatedArgs);
            sendResponse(id, result);
            break;
          }

          default:
            sendError(id, -32601, `Method not found: ${tool}`);
        }
        break;
      }

      default:
        sendError(id, -32601, `Method not found: ${method}`);
    }
  } catch (error) {
    logger.error({ error }, "Error handling request");
    if (error instanceof Error) {
      sendError(id, -32603, `Internal error: ${error.message}`);
    } else {
      sendError(id, -32603, "Internal error");
    }
  }
}

function sendResponse(id: number, result: any) {
  const response = {
    jsonrpc: "2.0",
    id,
    result,
  };

  logger.info({ response }, "Sending response");
  process.stdout.write(JSON.stringify(response) + "\n");
}

function sendError(id: number, code: number, message: string) {
  const response = {
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message,
    },
  };

  logger.error({ response }, "Sending error response");
  process.stdout.write(JSON.stringify(response) + "\n");
}

// 에러 처리
process.on("uncaughtException", (error) => {
  logger.fatal({ error }, "Uncaught exception");
});

process.on("unhandledRejection", (error) => {
  logger.fatal({ error }, "Unhandled rejection");
});

// 시작 로그
logger.info(
  {
    name: MCP_CONFIG.name,
    version: MCP_CONFIG.version,
  },
  "MCP Server started"
);
