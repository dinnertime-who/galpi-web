"use client";

import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export function useSignIn() {
  const signInMutation = useMutation({
    mutationKey: ["auth", "sign-in"],
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) throw new Error(error.message ?? "로그인에 실패했습니다.");
    },
  });

  const signInWithGoogle = () => authClient.signIn.social({ provider: "google", callbackURL: "/" });

  return { signInMutation, signInWithGoogle };
}
