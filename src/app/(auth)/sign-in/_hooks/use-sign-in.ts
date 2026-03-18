"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function useSignIn() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithEmail(email: string, password: string) {
    setError(null);
    setIsPending(true);
    const { error } = await authClient.signIn.email({ email, password });
    setIsPending(false);
    if (error) {
      setError(error.message ?? "로그인에 실패했습니다.");
      return;
    }
    router.push("/");
  }

  async function signInWithGoogle() {
    setError(null);
    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
  }

  return { isPending, error, signInWithEmail, signInWithGoogle };
}
