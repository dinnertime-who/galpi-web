"use client";

import { GoogleLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Separator } from "@/components/shadcn/separator";
import { useSignIn } from "@/hooks/page/sign-in/use-sign-in";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInMutation, signInWithGoogle } = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInMutation.mutateAsync({ email, password });
    router.push("/");
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">로그인</h1>
        <p className="text-xs text-muted-foreground">갈피에 오신 것을 환영합니다.</p>
      </div>

      <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={signInMutation.isPending}>
        <GoogleLogo weight="bold" />
        Google로 계속하기
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">또는</span>
        <Separator className="flex-1" />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">비밀번호</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >
              비밀번호 찾기
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {signInMutation.isError && <p className="text-xs text-destructive">{signInMutation.error.message}</p>}

        <Button type="submit" className="w-full" disabled={signInMutation.isPending}>
          {signInMutation.isPending ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        계정이 없으신가요?{" "}
        <Link href="/sign-up" className="text-foreground underline-offset-4 hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
