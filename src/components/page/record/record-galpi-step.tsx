"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react/ssr";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/shadcn/button";
import { Field, FieldError, FieldGroup } from "@/components/shadcn/field";
import { Textarea } from "@/components/shadcn/textarea";
import { useSetPendingRecord } from "@/hooks/auth/use-set-pending-record";
import { useSaveGalpi } from "@/hooks/page/record/use-save-galpi";
import { authClient } from "@/lib/auth-client";
import { useRecordPageStore } from "@/store/record-page.store";
import { SourceInputDialogRoot, SourceInputDialogTrigger } from "./source-input-dialog/source-input-dialog";

const schema = z.object({
  text: z.string().min(1, "기록할 문장을 입력해주세요.").max(100, "문장은 최대 100자까지 입력할 수 있습니다."),
  note: z.string().optional(),
  sourceTitle: z.string().optional(),
  sourceAuthor: z.string().optional(),
  sourceSubTitle: z.string().optional(),
  sourcePage: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function buildSource(values: FormValues) {
  if (!values.sourceTitle || !values.sourceAuthor) return undefined;
  return {
    title: values.sourceTitle,
    author: values.sourceAuthor,
    subTitle: values.sourceSubTitle || undefined,
    page: values.sourcePage ? parseInt(values.sourcePage, 10) : undefined,
  };
}

export function RecordGalpiStep() {
  const setExtractedText = useRecordPageStore((state) => state.setExtractedText);
  const setSelectedImageSrc = useRecordPageStore((state) => state.setSelectedImageSrc);
  const extractedText = useRecordPageStore((state) => state.extractedText);

  const { data } = authClient.useSession();
  const { saveGalpiMutation } = useSaveGalpi();
  const { setPendingRecordMutation } = useSetPendingRecord();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: { text: extractedText || "", note: "" },
  });

  useEffect(() => {
    if (extractedText) reset({ text: extractedText, note: "" });
  }, [extractedText, reset]);

  const textValue = watch("text");
  const sourceTitle = watch("sourceTitle");
  const sourceAuthor = watch("sourceAuthor");
  const sourcePage = watch("sourcePage");
  const sourceSubTitle = watch("sourceSubTitle");
  const hasSource = !!(sourceTitle && sourceAuthor);

  const handleClearSource = () => {
    setValue("sourceTitle", "");
    setValue("sourceAuthor", "");
    setValue("sourceSubTitle", "");
    setValue("sourcePage", "");
  };

  const handleSourceSave = (values: { title: string; author: string; subTitle?: string; page?: string }) => {
    setValue("sourceTitle", values.title);
    setValue("sourceAuthor", values.author);
    setValue("sourceSubTitle", values.subTitle ?? "");
    setValue("sourcePage", values.page ?? "");
  };

  const onSubmit = async (values: FormValues) => {
    const source = buildSource(values);

    if (!data) {
      await setPendingRecordMutation.mutateAsync({ text: values.text, note: values.note, source });
      return router.push("/sign-in");
    }

    await saveGalpiMutation.mutateAsync({ text: values.text, note: values.note || undefined, source });
    toast.success("갈피를 남겼습니다.");
    setExtractedText(null);
    setSelectedImageSrc(null);
    router.push("/");
  };

  return (
    <SourceInputDialogRoot
      onSave={handleSourceSave}
      initialValues={{ title: sourceTitle, author: sourceAuthor, subTitle: sourceSubTitle, page: sourcePage }}
    >
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field data-invalid={!!errors.text}>
            <div className="w-full text-start">
              <h3 className="text-galpi-heading font-ridi">내가 기록할 문장</h3>
              <p className="text-galpi-caption">기억에 남기고픈 특별한 문장을 기록해주세요.</p>
            </div>
            <Textarea
              className="flex-1 text-galpi-heading! font-ridi w-full text-center resize-none shadow-none h-32 border border-border p-4 bg-white"
              placeholder="기록할 문장을 직접 입력하거나 사진에서 가져오세요."
              aria-invalid={!!errors.text}
              {...register("text")}
            />
            <p
              className={`text-xs text-end w-full ${(textValue?.length ?? 0) > 100 ? "text-destructive" : "text-muted-foreground"}`}
            >
              {(textValue?.length ?? 0) > 100 && (
                <span className="text-xs text-destructive">문장은 최대 100자까지 입력할 수 있습니다. </span>
              )}
              {textValue?.length ?? 0}/100
            </p>

            <FieldError errors={[errors.text]} />
          </Field>

          <Field>
            <div className="w-full text-start">
              <h3 className="text-galpi-heading font-ridi">갈피 남기기</h3>
              <p className="text-galpi-caption">문장에 기억을 더 해줄 생각들을 남겨주세요.</p>
            </div>
            <Textarea
              className="flex-1 text-galpi-body! font-ridi w-full text-start resize-none shadow-none h-48 border border-border p-4 bg-white"
              placeholder="갈피를 남겨주세요."
              {...register("note")}
            />
          </Field>
        </FieldGroup>

        {/* 출처 섹션 */}
        <div className="flex flex-col gap-y-3">
          <div className="w-full text-start">
            <h3 className="text-galpi-heading font-ridi">출처</h3>
            <p className="text-galpi-caption">어떤 책에서 찾은 문장이신가요?</p>
          </div>

          {/* 미리보기 */}
          {hasSource ? (
            <div className="flex items-center justify-between gap-x-2 rounded-md border border-border bg-white px-4 py-3">
              <p className="text-galpi-caption font-ridi text-foreground truncate">
                {sourceAuthor} {"<"}
                {sourceTitle}
                {">"}
                {sourcePage ? ` ${sourcePage}p` : ""} 중에서
              </p>
              <button
                type="button"
                onClick={handleClearSource}
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="출처 삭제"
              >
                <XIcon className="size-4" />
              </button>
            </div>
          ) : (
            <p className="text-galpi-caption font-ridi text-muted-foreground">
              저자 {"<"}책이름{">"} ... 중에서
            </p>
          )}

          {/* 버튼 행 */}
          <div className="flex gap-x-2">
            <Button variant="outline" className="flex-1" type="button">
              <MagnifyingGlassIcon />
              <span>출처 찾아보기</span>
            </Button>
            {!hasSource && <SourceInputDialogTrigger />}
          </div>
        </div>

        {saveGalpiMutation.isError && (
          <FieldError className="text-center">{saveGalpiMutation.error.message}</FieldError>
        )}

        <Button type="submit" className="w-full" disabled={!isValid || saveGalpiMutation.isPending}>
          {saveGalpiMutation.isPending ? "저장 중..." : "갈피 저장하기"}
        </Button>

        <Button
          variant="outline"
          className="w-full"
          type="button"
          onClick={() => router.push("/")}
          disabled={saveGalpiMutation.isPending}
        >
          처음으로
        </Button>
      </form>
    </SourceInputDialogRoot>
  );
}
