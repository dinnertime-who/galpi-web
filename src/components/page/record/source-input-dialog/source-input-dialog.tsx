"use client";

import { PencilSimpleIcon } from "@phosphor-icons/react/ssr";
import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { SourceInputDialogProvider, useSourceInputDialog } from "./source-input-dialog.context";

type InitialValues = {
  title?: string;
  author?: string;
  subTitle?: string;
  page?: string;
};

type SourceInputDialogRootProps = {
  children: React.ReactNode;
  onSave: (values: { title: string; author: string; subTitle?: string; page?: string }) => void;
  initialValues?: InitialValues;
};

export function SourceInputDialogRoot({ children, onSave, initialValues }: SourceInputDialogRootProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [author, setAuthor] = useState(initialValues?.author ?? "");
  const [subTitle, setSubTitle] = useState(initialValues?.subTitle ?? "");
  const [page, setPage] = useState(initialValues?.page ?? "");

  return (
    <SourceInputDialogProvider
      context={{ open, setOpen, title, setTitle, author, setAuthor, subTitle, setSubTitle, page, setPage, onSave }}
    >
      {children}
      <SourceInputDialogView />
    </SourceInputDialogProvider>
  );
}

export function SourceInputDialogTrigger() {
  const { setOpen } = useSourceInputDialog();
  return (
    <Button variant="outline" className="flex-1" type="button" onClick={() => setOpen(true)}>
      <PencilSimpleIcon />
      <span>직접 입력하기</span>
    </Button>
  );
}

function SourceInputDialogView() {
  const { open, setOpen, title, setTitle, author, setAuthor, subTitle, setSubTitle, page, setPage, onSave } =
    useSourceInputDialog();

  const handleSave = () => {
    onSave({ title, author, subTitle: subTitle || undefined, page: page || undefined });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>출처 직접 입력</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel>제목</FieldLabel>
            <Input placeholder="책 제목" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>

          <Field>
            <FieldLabel>저자</FieldLabel>
            <Input placeholder="저자명" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </Field>

          <Field>
            <FieldLabel>
              부 제목
              <span className="ml-1 text-xs text-muted-foreground">(선택)</span>
            </FieldLabel>
            <Input placeholder="부제목 또는 챕터 제목" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
          </Field>

          <Field>
            <FieldLabel>
              페이지
              <span className="ml-1 text-xs text-muted-foreground">(선택)</span>
            </FieldLabel>
            <Input type="number" placeholder="예) 42" value={page} onChange={(e) => setPage(e.target.value)} />
          </Field>
        </FieldGroup>

        <DialogFooter>
          <Button type="button" className="w-full" onClick={handleSave} disabled={!title || !author}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
