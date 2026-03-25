import { queryOptions } from "@tanstack/react-query";
import { getGalpiByIdAction } from "@/actions/galpi/get-galpi-by-id.action";

export const getGalpiDetailOption = (id: string) =>
  queryOptions({
    queryKey: ["galpi", "detail", id],
    queryFn: async () => getGalpiByIdAction({ id }),
  });
