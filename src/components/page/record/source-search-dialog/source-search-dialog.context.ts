import { withContext } from "@/components/ui/with-context";

export type SourceSearchDialogContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (values: { title: string; author: string }) => void;
};

export const { Provider: SourceSearchDialogProvider, useContext: useSourceSearchDialog } =
  withContext<SourceSearchDialogContext>();
