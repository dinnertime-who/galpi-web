"use client";

import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export function useForgotPassword() {
  const forgotPasswordMutation = useMutation({
    mutationKey: ["auth", "forgot-password"],
    mutationFn: async ({ email }: { email: string }) => {
      const { error } = await authClient.forgetPassword({
        email,
        redirectTo: "/reset-password",
      });
      if (error) throw new Error(error.message ?? "요청에 실패했습니다.");
    },
  });

  return { forgotPasswordMutation };
}
