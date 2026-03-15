import { FirstSection } from "@/components/page/main/first-section";
import { RecordMethodDrawer } from "@/components/page/main/record-method-drawer";

export default function Home() {
  return (
    <div className="relative">
      <FirstSection />

      <RecordMethodDrawer />
    </div>
  );
}
