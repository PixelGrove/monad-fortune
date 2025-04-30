import { z } from "zod";

export const GetBalanceSchema = z.object({
  address: z.string().describe("Monad testnet address to check balance for"),
});

export const GetBlockInfoSchema = z.object({});

export const GetTransactionSchema = z.object({
  hash: z.string().describe("Transaction hash to look up"),
});

export type GetBalanceInput = z.infer<typeof GetBalanceSchema>;
export type GetBlockInfoInput = z.infer<typeof GetBlockInfoSchema>;
export type GetTransactionInput = z.infer<typeof GetTransactionSchema>;

export type MCPResponse = {
  content: Array<{
    type: "text";
    text: string;
  }>;
};
