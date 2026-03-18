import { RecordPageWrapper } from "@/components/page/record/record-page-wrapper";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/sign-in?callbackURL=/record");
  }

  return (
    <div className="p-6 min-h-[calc(100svh-4rem)]">
      <div className="overflow-x-clip overflow-y-scroll w-full">
        <RecordPageWrapper initialStep="select-method" />
      </div>
    </div>
  );
}
