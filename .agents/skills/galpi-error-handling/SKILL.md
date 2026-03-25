---
name: galpi-error-handling
description: >
  galpi-web 프로젝트에서 에러 처리 코드를 작성할 때 반드시 사용하는 스킬.
  서버 액션, API 호출, DB 쿼리, 외부 서비스 호출 등 예외가 발생할 수 있는 코드를 작성할 때 사용.
  "에러 처리", "try-catch", "서버 액션 작성", "action 만들어줘", "에러 핸들링"
  등 에러 처리 관련 코드 생성/수정 요청 시 반드시 사용.
  raw try/catch 대신 `tryCatch` 유틸을 사용한다.
---

# galpi-web 에러 처리 가이드

## 핵심 규칙

raw `try/catch`를 직접 쓰지 않는다. 대신 `@/lib/try-catch`의 유틸을 사용한다.

```
src/lib/try-catch.ts
```

세 가지 유틸:
- `tryCatch(fn)` — async 작업에 사용. `{ data, error, isSuccess }` 반환
- `tryCatchSync(fn)` — sync 작업에 사용. 동일한 구조 반환
- `tryCatchWithDefault(fn, defaultValue)` — 실패 시 기본값으로 대체할 때 사용

---

## 기본 패턴

```typescript
import { tryCatch } from "@/lib/try-catch";

const { data, error, isSuccess } = await tryCatch(() => someAsyncOperation());

if (!isSuccess) {
  // error는 타입이 좁혀짐
  console.error(error);
  return;
}

// 여기서 data는 null이 아님이 보장됨
console.log(data);
```

`isSuccess`가 판별 유니온(discriminated union) 역할을 하므로, `if (isSuccess)` 또는 `if (!isSuccess)` 이후 타입이 자동으로 좁혀진다.

---

## 서버 액션 패턴

서버 액션의 반환 타입은 `{ result: T } | { error: string }` 형태를 유지한다.
`tryCatch`로 예외를 잡고, 에러 메시지를 문자열로 변환해 반환한다.

```typescript
// src/server/example/actions/create-example.action.ts
"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { tryCatch } from "@/lib/try-catch";
import { db } from "@/integrations/db";

export async function createExampleAction(input: CreateExampleInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "인증이 필요합니다." };

  const { data, error, isSuccess } = await tryCatch(() =>
    db.insert(examples).values({ userId: session.user.id, ...input }).returning()
  );

  if (!isSuccess) {
    console.error(error);
    return { error: "저장에 실패했습니다." };
  }

  return { result: data[0] };
}
```

---

## DB 트랜잭션 패턴

트랜잭션 전체를 `tryCatch`로 감싼다.

```typescript
const { data: galpi, error, isSuccess } = await tryCatch(() =>
  db.transaction(async (tx) => {
    const [sentence] = await tx
      .insert(sentences)
      .values({ userId, text })
      .returning();

    const [galpi] = await tx
      .insert(galpis)
      .values({ userId, sentenceId: sentence.id, note })
      .returning();

    return galpi;
  })
);

if (!isSuccess) {
  console.error(error);
  return { error: "저장에 실패했습니다." };
}

return { result: galpi };
```

---

## 외부 API 호출 패턴

```typescript
const { data: response, isSuccess } = await tryCatch(() =>
  genAi.models.generateContent({ model, contents })
);

if (!isSuccess) return { error: "AI 응답을 받지 못했습니다." };

return { result: response.text ?? "결과 없음" };
```

---

## 기본값 대체 패턴

에러 시 기본값으로 처리해도 되는 경우 `tryCatchWithDefault`를 사용한다.

```typescript
import { tryCatchWithDefault } from "@/lib/try-catch";

// 실패해도 빈 배열로 진행 가능한 경우
const items = await tryCatchWithDefault(() => fetchItems(), []);
```

---

## 동기 코드 패턴

JSON 파싱, 정규식 처리 등 동기 작업에는 `tryCatchSync`를 사용한다.

```typescript
import { tryCatchSync } from "@/lib/try-catch";

const { data: parsed, isSuccess } = tryCatchSync(() => JSON.parse(rawString));
if (!isSuccess) return { error: "잘못된 형식입니다." };
```

---

## 안티패턴 ❌

```typescript
// ❌ raw try/catch — 사용 금지
try {
  const result = await db.insert(examples).values(input).returning();
  return { result: result[0] };
} catch (e) {
  console.error(e);
  return { error: "저장에 실패했습니다." };
}

// ✅ tryCatch 사용
const { data, isSuccess } = await tryCatch(() =>
  db.insert(examples).values(input).returning()
);
if (!isSuccess) return { error: "저장에 실패했습니다." };
return { result: data[0] };
```

---

## 체크리스트

- [ ] raw `try/catch` 대신 `tryCatch` / `tryCatchSync`를 사용했는가?
- [ ] `isSuccess`로 타입 가드를 사용했는가?
- [ ] 서버 액션 반환 타입이 `{ result: T } | { error: string }` 형태인가?
- [ ] 에러 로깅은 `console.error(error)`로 했는가?
- [ ] 클라이언트에 노출되는 에러 메시지는 한국어 문자열인가?
