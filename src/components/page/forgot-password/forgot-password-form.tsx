"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { useForgotPassword } from "@/hooks/page/forgot-password/use-forgot-password";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const { forgotPasswordMutation } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotPasswordMutation.mutateAsync({ email });
  };

  if (forgotPasswordMutation.isSuccess) {
    return (
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-lg font-semibold">이메일을 확인해주세요</h1>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{forgotPasswordMutation.variables?.email}</span>로 비밀번호
          재설정 링크를 보냈습니다.
        </p>
        <Link href="/sign-in" className="block text-xs text-muted-foreground underline-offset-4 hover:underline">
          로그인으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">비밀번호 찾기</h1>
        <p className="text-xs text-muted-foreground">가입한 이메일 주소를 입력하시면 재설정 링크를 보내드립니다.</p>
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

        {forgotPasswordMutation.isError && (
          <p className="text-xs text-destructive">{forgotPasswordMutation.error.message}</p>
        )}

        <Button type="submit" className="w-full" disabled={forgotPasswordMutation.isPending}>
          {forgotPasswordMutation.isPending ? "전송 중..." : "재설정 링크 보내기"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        <Link href="/sign-in" className="text-foreground underline-offset-4 hover:underline">
          로그인으로 돌아가기
        </Link>
      </p>
    </div>
  );
}
