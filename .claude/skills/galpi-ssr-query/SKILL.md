---
name: galpi-ssr-query
description: >
  galpi-web 프로젝트에서 useQuery에 SSR을 적용할 때 사용하는 스킬.
  "SSR 적용해줘", "서버에서 미리 가져오기", "HydrationBoundary", "queryOptions 만들어줘",
  "useQuery SSR", "prefetch", "초기 데이터 서버에서 로드" 등 요청 시 반드시 사용.
  page.tsx(Server Component)에서 데이터를 미리 가져와 클라이언트에 hydrate하는
  3-파일 패턴(option.ts → hook.ts → page.tsx)을 따른다.
---

# galpi-web useQuery SSR 가이드

## 언제 SSR을 적용하는가

| 상황 | 방법 |
|------|------|
| 페이지 진입 시 데이터가 바로 보여야 할 때 (SEO, 초기 렌더링) | **SSR (이 스킬)** |
| 사용자 인터랙션으로 데이터를 불러올 때 | 클라이언트 useQuery |
| 무한스크롤, 페이지네이션 | 클라이언트 useInfiniteQuery |

---

## 3-파일 패턴

```
src/hooks/page/<page-name>/use-<name>.option.ts  ← queryOptions 정의
src/hooks/page/<page-name>/use-<name>.ts          ← useQuery 훅
src/app/(platform)/<page-name>/page.tsx           ← SSR + HydrationBoundary
```

### 왜 option.ts를 분리하는가?
`queryOptions`는 서버(page.tsx)와 클라이언트(hook) 양쪽에서 import된다.
`.option.ts`를 별도 파일로 분리해야 `"use server"` / `"use client"` 경계를 넘을 수 있다.

---

## 구현 순서

### 1. option.ts — queryOptions 정의

```typescript
// src/hooks/page/galpi/use-galpi-detail.option.ts
import { queryOptions } from "@tanstack/react-query";
import { getGalpiByIdAction } from "@/actions/galpi/get-galpi-by-id.action";

export const getGalpiDetailOption = (id: string) =>
  queryOptions({
    queryKey: ["galpi", "detail", id],
    queryFn: async () => getGalpiByIdAction({ id }),
  });
```

- `"use client"` / `"use server"` 선언 없음 — 양쪽에서 import 가능
- `queryKey`는 `[도메인, 타입, 식별자]` 형태로 구성
- `queryFn`은 Server Action을 직접 호출

### 2. hook.ts — 클라이언트 훅

```typescript
// src/hooks/page/galpi/use-galpi-detail.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getGalpiDetailOption } from "./use-galpi-detail.option";

export function useGalpiDetail(id: string) {
  const query = useQuery(getGalpiDetailOption(id));
  return query;
}
```

- `"use client"` 필수
- `queryOptions`를 그대로 `useQuery`에 전달
- HydrationBoundary가 있으면 서버에서 미리 채운 캐시를 읽어 **로딩 없이** 바로 렌더링

### 3. page.tsx — SSR + HydrationBoundary

```typescript
// src/app/(platform)/galpi/[id]/page.tsx
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { GalpiDetail } from "@/components/page/galpi/galpi-detail";
import { getGalpiDetailOption } from "@/hooks/page/galpi/use-galpi-detail.option";
import { getQueryClient } from "@/integrations/tanstack-query/client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const queryClient = getQueryClient();

  // 서버에서 데이터를 미리 채운다
  const { result, error } = await queryClient.ensureQueryData(getGalpiDetailOption(id));

  // 데이터가 없으면 404
  if (error || !result) return notFound();

  // 캐시를 직렬화해서 클라이언트로 전달
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GalpiDetail id={id} />
    </HydrationBoundary>
  );
}
```

- `getQueryClient()` — 서버에서는 매번 새 인스턴스, 브라우저에서는 싱글톤 (`src/integrations/tanstack-query/client.ts`)
- `ensureQueryData` — 캐시에 없으면 queryFn 실행, 있으면 캐시 반환
- `dehydrate(queryClient)` — 서버 캐시를 직렬화
- `HydrationBoundary` — 직렬화된 캐시를 클라이언트 QueryClient에 복원

---

## 클라이언트 컴포넌트에서 사용

```typescript
// src/components/page/galpi/galpi-detail.tsx
"use client";

import { useGalpiDetail } from "@/hooks/page/galpi/use-galpi-detail";

export function GalpiDetail({ id }: { id: string }) {
  const { data } = useGalpiDetail(id);

  // 첫 렌더링부터 data가 채워져 있음 (로딩 상태 없음)
  return (
    <p>{data?.result?.sentence.text}</p>
  );
}
```

HydrationBoundary 덕분에 `isLoading`이 `false`이고 `data`가 바로 존재한다.

---

## 인증이 필요한 SSR

인증이 필요한 경우 `ensureQueryData` 전에 세션 체크:

```typescript
export default async function Page({ params }: Props) {
  const { id } = await params;

  // 인증 체크 먼저
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/sign-in?callbackURL=...");

  const queryClient = getQueryClient();
  const { result, error } = await queryClient.ensureQueryData(getGalpiDetailOption(id));
  if (error || !result) return notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GalpiDetail id={id} />
    </HydrationBoundary>
  );
}
```

---

## 체크리스트

- [ ] `option.ts`에 `"use client"` / `"use server"` 선언이 **없는가**?
- [ ] `hook.ts`에 `"use client"` 선언했는가?
- [ ] `page.tsx`에 `getQueryClient()` → `ensureQueryData()` → `dehydrate()` → `HydrationBoundary` 순서가 맞는가?
- [ ] `queryKey`가 고유한가? (같은 키를 쓰는 다른 쿼리와 충돌하지 않는가)
- [ ] 데이터가 없을 때 `notFound()` 또는 적절한 처리를 했는가?
