import { headers } from "next/headers";
import { FirstSection } from "@/components/page/main/first-section";
import { auth } from "@/lib/auth";
import { getLatestGalpiAction } from "@/server/galpi/actions/get-latest-galpi.action";

export default async function Home() {
  const [{ result }, session] = await Promise.all([
    getLatestGalpiAction(),
    auth.api.getSession({ headers: await headers() }),
  ]);
  return (
    <div className="relative">
      <FirstSection latestGalpi={result} userName={session?.user.name ?? null} />
    </div>
  );
}
