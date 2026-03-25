"use client";

import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export function useSignUp() {
  const signUpMutation = useMutation({
    mutationKey: ["auth", "sign-up"],
    mutationFn: async ({ name, email, password }: { name: string; email: string; password: string }) => {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });
      if (error) throw new Error(error.message ?? "회원가입에 실패했습니다.");
    },
  });

  const signUpWithGoogle = () => authClient.signIn.social({ provider: "google", callbackURL: "/" });

  return { signUpMutation, signUpWithGoogle };
}
