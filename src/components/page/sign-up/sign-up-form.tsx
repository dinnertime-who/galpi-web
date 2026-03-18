"use client";

import { GoogleLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Separator } from "@/components/shadcn/separator";
import { useSignUp } from "@/hooks/page/sign-up/use-sign-up";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUpMutation, signUpWithGoogle } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUpMutation.mutateAsync({ name, email, password });
    router.push("/");
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">회원가입</h1>
        <p className="text-xs text-muted-foreground">갈피를 시작해보세요.</p>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={signUpWithGoogle}
        disabled={signUpMutation.isPending}
      >
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
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            type="text"
            placeholder="홍길동"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {signUpMutation.isError && (
          <p className="text-xs text-destructive">
            {signUpMutation.error.message}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={signUpMutation.isPending}
        >
          {signUpMutation.isPending ? "가입 중..." : "회원가입"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/sign-in"
          className="text-foreground underline-offset-4 hover:underline"
        >
          로그인
        </Link>
      </p>
    </div>
  );
}
