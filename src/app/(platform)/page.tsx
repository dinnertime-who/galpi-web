import { FirstSection } from "@/components/page/main/first-section";
import { MainGalpiList } from "@/components/page/main/main-galpi-list";
import { Separator } from "@/components/shadcn/separator";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className="relative">
      <FirstSection />
      <Separator className="my-6 h-px mx-4" />
      <MainGalpiList />
    </div>
  );
}
