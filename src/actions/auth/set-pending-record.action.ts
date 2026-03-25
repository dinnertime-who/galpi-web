"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { validateRequest } from "../utils";

export const SetPendingRecordRequest = z.object({
  text: z.string().min(1),
  note: z.string().optional(),
});

export async function setPendingRecordAction(values: z.infer<typeof SetPendingRecordRequest>) {
  const { data, error } = validateRequest(SetPendingRecordRequest, values);
  if (error) return { error: error.message };

  const cookieStore = await cookies();
  cookieStore.set("record-pending-values", JSON.stringify(data), {
    path: "/",
    maxAge: 600,
    sameSite: "lax",
  });
  cookieStore.set("auth-redirect-url", "/record", {
    path: "/",
    maxAge: 600,
    sameSite: "lax",
  });

  return { result: true };
}
