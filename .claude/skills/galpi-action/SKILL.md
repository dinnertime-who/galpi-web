---
name: galpi-action
description: >
  galpi-web 프로젝트에서 Next.js Server Action을 작성할 때 사용하는 스킬.
  "액션 만들어줘", "서버 액션 추가", "action 작성", "DB에 저장하는 action",
  "서버에서 처리하는 로직", "mutation용 server action" 등 Server Action 생성/수정
  요청 시 반드시 사용. src/actions/ 하위에 위치하며, zod 스키마 검증 +
  tryCatch 에러 처리 패턴을 따른다.
---

# galpi-web Server Action 작성 가이드

## 핵심 규칙

- 파일 최상단 `"use server"` 선언 필수
- **zod 스키마**로 입력값 검증 — `validateRequest` 유틸 사용
- DB 접근 등 비동기 로직은 **`tryCatch`**로 감싸기
- 반환값은 항상 `{ result }` 또는 `{ error: string }` 형태
- 인증이 필요한 action은 `auth.api.getSession`으로 세션 확인 후 진행

---

## 파일 위치

```
src/actions/<domain>/<action-name>.action.ts
```

예시:
```
src/actions/galpi/save-galpi.action.ts
src/actions/sentence/delete-sentence.action.ts
src/actions/user/update-profile.action.ts
```

공통 유틸: `src/actions/utils.ts` (`getSession`, `validateRequest`)

---

## 기본 패턴 (인증 필요)

```typescript
// src/actions/galpi/save-galpi.action.ts
"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/integrations/db";
import { galpis } from "@/integrations/db/schema";
import { auth } from "@/lib/auth";
import { tryCatch } from "@/lib/try-catch";
import { validateRequest } from "../utils";

export const SaveGalpiActionRequest = z.object({
  text: z.string().min(1, "기록할 문장을 입력해주세요."),
  note: z.string().optional(),
});

export async function saveGalpiAction(input: z.infer<typeof SaveGalpiActionRequest>) {
  // 1. 인증 확인
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "인증이 필요합니다." };

  // 2. 입력값 검증
  const { data, error } = validateRequest(SaveGalpiActionRequest, input);
  if (error) return { error: error.message };

  // 3. DB 작업 — tryCatch로 감싸기
  const { data: result, error: dbError } = await tryCatch(async () => {
    return db.transaction(async (tx) => {
      // ... DB 작업
    });
  });

  if (dbError) return { error: dbError.message };

  return { result };
}
```

---

## 인증 불필요한 action 패턴

```typescript
"use server";

import { z } from "zod";
import { tryCatch } from "@/lib/try-catch";
import { validateRequest } from "../utils";

export const SomePublicActionRequest = z.object({
  id: z.string().min(1),
});

export async function somePublicAction(input: z.infer<typeof SomePublicActionRequest>) {
  const { data, error } = validateRequest(SomePublicActionRequest, input);
  if (error) return { error: error.message };

  const { data: result, error: actionError } = await tryCatch(async () => {
    // ... 로직
  });

  if (actionError) return { error: actionError.message };

  return { result };
}
```

---

## utils.ts 제공 유틸

```typescript
// src/actions/utils.ts 에서 import
import { getSession, validateRequest } from "../utils";
// 또는
import { getSession, validateRequest } from "@/actions/utils";
```

- **`getSession()`** — `auth.api.getSession` 래퍼. 실패 시 `null` 반환
- **`validateRequest(schema, input)`** — zod 검증. 실패 시 `{ data: null, error: { message } }` 반환

---

## 반환 타입 규칙

action은 항상 두 가지 중 하나를 반환:

| 케이스 | 반환 형태 |
|--------|-----------|
| 성공 | `{ result: <데이터> }` |
| 실패 | `{ error: string }` (한국어 메시지) |

hook의 `mutationFn`에서 이 패턴을 처리:

```typescript
// hook에서 action 호출 시
mutationFn: async (vars) => {
  const { result, error } = await someAction(vars);
  if (error) throw new Error(error); // useMutation이 isError 상태로 전환
  return result;
}
```

---

## 체크리스트

- [ ] `"use server"` 선언했는가?
- [ ] zod 스키마를 `export const XxxRequest = z.object({...})` 로 export했는가?
- [ ] `validateRequest`로 입력값 검증했는가?
- [ ] 인증이 필요한 경우 세션 확인을 가장 먼저 했는가?
- [ ] DB/비동기 작업을 `tryCatch`로 감쌌는가?
- [ ] 반환값이 `{ result }` 또는 `{ error: string }` 형태인가?
- [ ] 에러 메시지가 한국어인가?
