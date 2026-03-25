import { FirstSection } from "@/components/page/main/first-section";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className="relative">
      <FirstSection />
    </div>
  );
}
