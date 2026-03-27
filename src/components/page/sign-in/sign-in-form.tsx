"use client";

import { GoogleLogoIcon } from "@phosphor-icons/react";
import { Button } from "@/components/shadcn/button";
import { authClient } from "@/lib/auth-client";

export function SignInForm() {
  const signInWithGoogle = () => authClient.signIn.social({ provider: "google", callbackURL: "/sign-in/callback" });

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-lg font-semibold font-ridi">로그인</h1>
        <p className="text-xs text-muted-foreground">갈피에 오신 것을 환영합니다.</p>
      </div>

      <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
        <GoogleLogoIcon weight="bold" />
        Google로 계속하기
      </Button>
    </div>
  );
}
