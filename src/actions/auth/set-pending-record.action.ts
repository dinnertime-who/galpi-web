"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { validateRequest } from "../utils";

const setPendingRecordRequest = z.object({
  text: z.string().min(1),
  note: z.string().optional(),
  source: z
    .object({
      title: z.string().min(1),
      author: z.string().min(1),
      subTitle: z.string().optional(),
      page: z.number().int().positive().optional(),
    })
    .optional(),
});
export type SetPendingRecordRequest = z.infer<typeof setPendingRecordRequest>;

export async function setPendingRecordAction(values: SetPendingRecordRequest) {
  const { data, error } = validateRequest(setPendingRecordRequest, values);
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
