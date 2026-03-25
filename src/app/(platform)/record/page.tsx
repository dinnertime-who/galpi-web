import { RecordPageWrapper } from "@/components/page/record/record-page-wrapper";

export default async function Page() {
  return (
    <div className="p-6 min-h-[calc(100svh-4rem)]">
      <div className="overflow-x-clip overflow-y-scroll w-full">
        <RecordPageWrapper initialStep="select-method" />
      </div>
    </div>
  );
}
