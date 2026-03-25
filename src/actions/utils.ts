import "server-only";
import { headers } from "next/headers";
import type { ZodType } from "zod";
import { auth } from "@/lib/auth";
import { tryCatch } from "@/lib/try-catch";

export async function getSession() {
  const {
    data: session,
    error,
    isSuccess,
  } = await tryCatch(async () => {
    return auth.api.getSession({ headers: await headers() });
  });

  if (!isSuccess) {
    console.error(error);
    return null;
  }

  return session;
}

export function validateRequest<T extends {}>(
  schema: ZodType<T>,
  input: unknown,
): { data: T; error: null } | { data: null; error: { message: string } } {
  const result = schema.safeParse(input);

  if (!result.success) {
    const message = result.error.issues.map((i) => i.message).join(", ");
    return { data: null, error: { message } } as const;
  }

  return { data: result.data, error: null } as const;
}
