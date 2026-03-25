import { withContext } from "@/components/ui/with-context";

export type SourceInputDialogContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  setTitle: (v: string) => void;
  author: string;
  setAuthor: (v: string) => void;
  subTitle: string;
  setSubTitle: (v: string) => void;
  page: string;
  setPage: (v: string) => void;
  onSave: (values: { title: string; author: string; subTitle?: string; page?: string }) => void;
};

export const { Provider: SourceInputDialogProvider, useContext: useSourceInputDialog } =
  withContext<SourceInputDialogContext>();
