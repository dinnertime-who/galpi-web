---
name: galpi-page
description: >
  galpi-web 프로젝트에서 Next.js page.tsx를 작성할 때 사용하는 스킬.
  "페이지 만들어줘", "page.tsx 작성", "새 페이지 추가", "(auth) 페이지",
  "(platform) 페이지" 등 페이지 생성/수정 요청 시 반드시 사용.
  이 프로젝트의 page.tsx는 항상 Server Component여야 하며,
  인증 체크, 리다이렉트 등 서버 로직만 담고 UI는 Client Component에 위임한다.
---

# galpi-web Page 작성 가이드

## 핵심 규칙

**`page.tsx`는 반드시 Server Component** — `"use client"` 절대 금지.

UI 인터랙션이 필요하면 Client Component를 만들어 page.tsx에서 import해서 렌더링한다.

---

## 파일 위치

```
src/app/(auth)/<page-name>/page.tsx        ← 인증 불필요 페이지 (로그인, 회원가입 등)
src/app/(platform)/<page-name>/page.tsx   ← 인증 필요 페이지
```

UI 컴포넌트는 `src/components/page/<page-name>/` 에 위치. (→ galpi-component 스킬 참조)

---

## 기본 패턴

### 1. 인증이 필요 없는 페이지 (auth 그룹)

```typescript
// src/app/(auth)/sign-in/page.tsx
import { SignInForm } from "@/components/page/sign-in/sign-in-form";

export default function SignInPage() {
  return <SignInForm />;
}
```

### 2. 인증이 필요한 페이지 (platform 그룹)

```typescript
// src/app/(platform)/bookshelf/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BookshelfView } from "@/components/page/bookshelf/bookshelf-view";

export default async function BookshelfPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/sign-in?callbackURL=/bookshelf");
  }

  return <BookshelfView session={session} />;
}
```

---

## 체크리스트

- [ ] `"use client"` 없는가?
- [ ] 인증이 필요한 페이지라면 `auth.api.getSession()` 체크 했는가?
- [ ] 미인증 시 `redirect("/sign-in?callbackURL=<path>")` 처리했는가?
- [ ] UI는 `src/components/page/<page-name>/` 컴포넌트에 위임했는가?
- [ ] `import "server-only"` 가 필요한 유틸을 사용했다면 import 했는가?
