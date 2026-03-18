---
name: galpi-hook
description: >
  galpi-web 프로젝트에서 페이지용 custom hook을 작성할 때 사용하는 스킬.
  "훅 만들어줘", "useXxx 작성", "API 요청 훅", "mutation 훅",
  "useMutation 훅 추가" 등 hook 생성/수정 요청 시 반드시 사용.
  HTTP 요청은 반드시 useMutation/useQuery를 사용하고, mutateAsync를 사용한다.
  onSuccess에서 라우팅 처리 금지 — 호출하는 컴포넌트에서 처리.
---

# galpi-web Hook 작성 가이드

## 핵심 규칙

- `"use client"` 선언 필수
- **반드시 `use`로 시작하는 함수를 export**
- HTTP 요청 → `useMutation` 또는 `useQuery` 사용
- `mutate` 대신 **`mutateAsync`** 사용 (호출부에서 await)
- `onSuccess`에서 `router.push` 금지 — redirect는 컴포넌트 책임

---

## 파일 위치

```
src/hooks/page/<page-name>/use-<hook-name>.ts
```

예시:
```
src/hooks/page/sign-in/use-sign-in.ts
src/hooks/page/sign-up/use-sign-up.ts
src/hooks/page/bookshelf/use-bookshelf.ts
```

---

## useMutation 패턴

```typescript
// src/hooks/page/sign-in/use-sign-in.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

type SignInVariables = { email: string; password: string };

export function useSignIn() {
  const signInMutation = useMutation({
    mutationKey: ["auth", "sign-in"],
    mutationFn: async ({ email, password }: SignInVariables) => {
      const { error } = await authClient.signIn.email({ email, password });
      // 에러는 throw — useMutation이 isError 상태로 전환
      if (error) throw new Error(error.message ?? "로그인에 실패했습니다.");
    },
    // onSuccess에서 router.push 금지
  });

  // redirect가 아닌 단순 호출 함수는 hook 내에서 정의 가능
  const signInWithGoogle = () =>
    authClient.signIn.social({ provider: "google", callbackURL: "/" });

  return { signInMutation, signInWithGoogle };
}
```

---

## useQuery 패턴

```typescript
// src/hooks/page/bookshelf/use-bookshelf-items.ts
"use client";

import { useQuery } from "@tanstack/react-query";

export function useBookshelfItems() {
  const bookshelfQuery = useQuery({
    queryKey: ["bookshelf", "items"],
    queryFn: async () => {
      const res = await fetch("/api/bookshelf");
      if (!res.ok) throw new Error("불러오기 실패");
      return res.json();
    },
  });

  return { bookshelfQuery };
}
```

---

## 에러 처리 원칙

`mutationFn` 내부에서 에러를 **반드시 throw**:

```typescript
// ✅ 올바른 방법
mutationFn: async (vars) => {
  const { data, error } = await someApiCall(vars);
  if (error) throw new Error(error.message ?? "기본 에러 메시지");
  return data;
}

// ❌ 하지 말 것 — 에러를 return하거나 setState로 처리
mutationFn: async (vars) => {
  const { error } = await someApiCall(vars);
  setError(error.message); // ❌
}
```

컴포넌트에서는 `mutation.isError`와 `mutation.error.message`로 렌더링.

---

## 컴포넌트에서 사용 방법

```typescript
// 컴포넌트에서 mutateAsync 사용
const { signInMutation } = useSignIn();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  await signInMutation.mutateAsync({ email, password });
  router.push("/"); // ← 여기서 redirect 처리
};
```

---

## 체크리스트

- [ ] `"use client"` 선언했는가?
- [ ] 함수 이름이 `use`로 시작하는가?
- [ ] HTTP 요청에 `useMutation` / `useQuery` 사용했는가?
- [ ] `mutate` 대신 `mutateAsync`를 사용하도록 export했는가?
- [ ] `onSuccess`에서 `router.push` 하지 않았는가?
- [ ] 에러를 `throw new Error(...)` 로 처리했는가?
