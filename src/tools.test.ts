import { describe, it, expect, beforeAll } from "vitest";
import { getMonBalance, getBlockInfo, getTransaction } from "./tools.js";
import { ethers } from "ethers";

describe("Monad Testnet Tools", () => {
  const testAddress = "0x1234567890123456789012345678901234567890";
  const testTxHash =
    "0x1234567890123456789012345678901234567890123456789012345678901234";

  it("should get MON balance", async () => {
    const result = await getMonBalance({ address: testAddress });
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0]).toHaveProperty("type", "text");
    expect(result.content[0]).toHaveProperty("text");
  });

  it("should get block info", async () => {
    const result = await getBlockInfo({});
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0]).toHaveProperty("type", "text");
    expect(result.content[0]).toHaveProperty("text");
    expect(result.content[0].text).toContain("Block Number");
  });

  it("should get transaction info", async () => {
    const result = await getTransaction({ hash: testTxHash });
    expect(result).toHaveProperty("content");
    expect(result.content).toHaveLength(1);
    expect(result.content[0]).toHaveProperty("type", "text");
    expect(result.content[0]).toHaveProperty("text");
  });
});
