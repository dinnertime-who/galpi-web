import { withContext } from "@/components/ui/with-context";

export type SourceSearchSelectedBook = {
  title: string;
  author: string;
  isbn?: string;
  image?: string;
  link?: string;
  pubdate?: string;
  publisher?: string;
};

export type SourceSearchDialogContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (values: SourceSearchSelectedBook) => void;
};

export const { Provider: SourceSearchDialogProvider, useContext: useSourceSearchDialog } =
  withContext<SourceSearchDialogContext>();
