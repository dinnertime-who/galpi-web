import { type NextRequest, NextResponse } from "next/server";
import { clearPendingRecordAction, getPendingRecordAction } from "@/actions/auth/get-pending-record.action";
import { saveGalpiAction } from "@/actions/galpi/save-galpi.action";
import { getSession } from "@/actions/utils";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  console.log(origin);

  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/sign-in", origin));

  const { result: pending } = await getPendingRecordAction();

  if (pending) {
    await saveGalpiAction(pending.values);
    await clearPendingRecordAction();
  }

  return NextResponse.redirect(new URL("/", origin));
}
