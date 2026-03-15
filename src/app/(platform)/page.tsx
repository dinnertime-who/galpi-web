import { FirstSection } from "@/components/page/main/first-section";
import { RecordMethodDrawer } from "@/components/page/main/record-method-drawer";
import { CapturePage } from "@/components/page/capture-page";

export default function Home() {
  return (
    <div className="relative">
      <FirstSection />

      <CapturePage.Provider>
        <CapturePage.StreamView />
        <RecordMethodDrawer />
      </CapturePage.Provider>
    </div>
  );
}
