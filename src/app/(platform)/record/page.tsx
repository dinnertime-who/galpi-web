import { RecordPageWrapper } from "@/components/page/record/record-page-wrapper";

export default function Page() {
  return (
    <div className="p-6 min-h-[calc(100svh-4rem)]">
      <h1 className="text-galpi-heading font-bold text-center mb-6">
        오늘의 갈피 기록하기
      </h1>
      <div className="overflow-hidden w-full">
        <RecordPageWrapper initialStep="select-method" />
      </div>
    </div>
  );
}
