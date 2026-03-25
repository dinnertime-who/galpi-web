import { NextResponse } from "next/server";
import { clearPendingRecordAction, getPendingRecordAction } from "@/actions/auth/get-pending-record.action";
import { saveGalpiAction } from "@/actions/galpi/save-galpi.action";
import { getSession } from "@/actions/utils";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);

  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/sign-in", origin));

  const { result: pending } = await getPendingRecordAction();

  if (pending) {
    await saveGalpiAction(pending.values);
    await clearPendingRecordAction();
  }

  return NextResponse.redirect(new URL("/", origin));
}
