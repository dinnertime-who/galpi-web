---
name: galpi-component
description: >
  galpi-web 프로젝트에서 페이지용 Client Component를 작성할 때 사용하는 스킬.
  "컴포넌트 만들어줘", "폼 컴포넌트", "UI 컴포넌트 추가",
  "sign-in-form", "페이지 컴포넌트" 등 컴포넌트 생성/수정 요청 시 반드시 사용.
  컴포넌트는 SRP를 지키며 UI만 담당하고, 로직은 hook으로 분리한다.
---

# galpi-web Component 작성 가이드

## 핵심 규칙

- 페이지용 컴포넌트는 **`"use client"`** 선언 필수
- **SRP**: 컴포넌트는 UI 렌더링만, 비즈니스 로직은 hook으로 분리
- UI 라이브러리: `@/components/shadcn/` 의 컴포넌트 우선 사용

---

## 파일 위치

```
src/components/page/<page-name>/<component-name>.tsx
```

예시:
```
src/components/page/sign-in/sign-in-form.tsx
src/components/page/bookshelf/bookshelf-view.tsx
src/components/page/record/record-galpi-step.tsx
```

훅은 `src/hooks/page/<page-name>/` 에 위치. (→ galpi-hook 스킬 참조)

---

## 기본 패턴

```typescript
// src/components/page/sign-in/sign-in-form.tsx
"use client";

import { GoogleLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { useSignIn } from "@/hooks/page/sign-in/use-sign-in";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInMutation, signInWithGoogle } = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInMutation.mutateAsync({ email, password });
    router.push("/"); // redirect는 컴포넌트에서 처리 (hook X)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... */}
      {signInMutation.isError && (
        <p className="text-xs text-destructive">
          {signInMutation.error.message}
        </p>
      )}
      <Button type="submit" disabled={signInMutation.isPending}>
        {signInMutation.isPending ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
```

---

## 에러 / 로딩 상태 처리

`useMutation`의 상태를 직접 사용:

| 상태 | 사용 방법 |
|------|-----------|
| 로딩 중 | `mutation.isPending` |
| 에러 메시지 | `mutation.isError && mutation.error.message` |
| 성공 여부 | `mutation.isSuccess` |
| 전달한 변수 | `mutation.variables` (성공/에러 화면에서 활용) |

---

## redirect 처리 원칙

**hook의 `onSuccess`에서 `router.push` 금지** — 컴포넌트에서 `mutateAsync` 뒤에 처리:

```typescript
// ✅ 올바른 방법
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  await mutation.mutateAsync(vars);
  router.push("/"); // mutateAsync가 throw 없이 완료되면 실행됨
};

// ❌ 하지 말 것
// hook의 onSuccess: () => router.push("/")
```

---

## 체크리스트

- [ ] `"use client"` 선언했는가?
- [ ] `export function` (named export) 사용했는가?
- [ ] 로직은 hook으로 분리했는가? (`src/hooks/page/<page-name>/`)
- [ ] redirect는 컴포넌트에서 `mutateAsync` 이후 처리했는가?
- [ ] shadcn 컴포넌트 (`@/components/shadcn/`) 를 활용했는가?
