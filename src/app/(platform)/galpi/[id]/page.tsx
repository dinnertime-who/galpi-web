import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { GalpiDetail } from "@/components/page/galpi/galpi-detail";
import { getGalpiDetailOption } from "@/hooks/page/galpi/use-galpi-detail.option";
import { getQueryClient } from "@/integrations/tanstack-query/client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const queryClient = getQueryClient();
  const { result, error } = await queryClient.ensureQueryData(getGalpiDetailOption(id));

  if (error || !result) return notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GalpiDetail id={id} />
    </HydrationBoundary>
  );
}
