# Monad Quick Fortune MCP Server

Monad Testnet과 상호작용하는 MCP 서버입니다.

## 기능

- MON 잔액 조회
- 블록 정보 조회

## 설치

```bash
npm install -g monad-quick-fortune
```

또는

```bash
npx monad-quick-fortune
```

## Claude Desktop 설정

1. Claude Desktop을 엽니다.
2. 설정 > 개발자로 이동합니다.
3. `claude_desktop_config.json` 파일을 열고 다음 내용을 추가합니다:

```json
{
  "mcpServers": {
    "monad-quick-fortune": {
      "command": "node",
      "args": ["./build/index.js"]
    }
  }
}
```

4. Claude Desktop을 재시작합니다.

## 사용 방법

Claude와 대화하면서 다음과 같은 명령을 사용할 수 있습니다:

- "0x123... 주소의 MON 잔액을 확인해줘"
- "최신 블록 정보를 알려줘"

## 로그

로그 파일은 다음 위치에 저장됩니다:

```
~/.claude/filesystem/monad-quick-fortune/logs/app.log
```

## 개발

```bash
# 의존성 설치
npm install

# 개발 모드로 실행
npm run dev

# 빌드
npm run build

# 실행
npm start
```

## 라이센스

ISC
