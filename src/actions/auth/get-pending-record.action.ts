"use server";

import { cookies } from "next/headers";

export async function getPendingRecordAction() {
  const cookieStore = await cookies();

  const rawValues = cookieStore.get("record-pending-values")?.value;
  const redirectUrl = cookieStore.get("auth-redirect-url")?.value;

  if (!rawValues) return { result: null };

  try {
    const values = JSON.parse(rawValues) as { text: string; note?: string };
    return { result: { values, redirectUrl: redirectUrl ?? null } };
  } catch {
    return { result: null };
  }
}

export async function clearPendingRecordAction() {
  const cookieStore = await cookies();
  cookieStore.delete("record-pending-values");
  cookieStore.delete("auth-redirect-url");
  return { result: true };
}
