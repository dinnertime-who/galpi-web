"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function useSignUp() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signUp(name: string, email: string, password: string) {
    setError(null);
    setIsPending(true);
    const { error } = await authClient.signUp.email({ name, email, password });
    setIsPending(false);
    if (error) {
      setError(error.message ?? "회원가입에 실패했습니다.");
      return;
    }
    router.push("/");
  }

  async function signUpWithGoogle() {
    setError(null);
    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
  }

  return { isPending, error, signUp, signUpWithGoogle };
}
