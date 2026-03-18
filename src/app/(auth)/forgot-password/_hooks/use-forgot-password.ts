"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function useForgotPassword() {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestPasswordReset(email: string) {
    setError(null);
    setIsPending(true);
    const { error } = await authClient.forgetPassword({
      email,
      redirectTo: "/reset-password",
    });
    setIsPending(false);
    if (error) {
      setError(error.message ?? "요청에 실패했습니다.");
      return;
    }
    setIsSuccess(true);
  }

  return { isPending, isSuccess, error, requestPasswordReset };
}
