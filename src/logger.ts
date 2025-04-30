import pino from "pino";
import { homedir } from "os";
import { join } from "path";
import { mkdirSync } from "fs";

// 로그 디렉토리 설정
const LOG_DIR = join(
  homedir(),
  ".claude",
  "filesystem",
  "monad-quick-fortune",
  "logs"
);

// 로그 디렉토리 생성
try {
  mkdirSync(LOG_DIR, { recursive: true });
} catch (error) {
  console.error("Failed to create log directory:", error);
}

// 로거 설정
export const logger = pino.default(
  {
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
      },
    },
  },
  pino.destination(join(LOG_DIR, "app.log"))
);
