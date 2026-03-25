"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/shadcn/button";
import { Field, FieldError, FieldGroup } from "@/components/shadcn/field";
import { Textarea } from "@/components/shadcn/textarea";
import { useSaveGalpi } from "@/hooks/page/record/use-save-galpi";
import { useRecordPageStore } from "@/store/record-page.store";

const schema = z.object({
  text: z.string().min(1, "기록할 문장을 입력해주세요."),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function RecordGalpiStep() {
  const setExtractedText = useRecordPageStore((state) => state.setExtractedText);
  const setSelectedImageSrc = useRecordPageStore((state) => state.setSelectedImageSrc);
  const extractedText = useRecordPageStore((state) => state.extractedText);

  const { saveGalpiMutation } = useSaveGalpi();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: { text: extractedText || "", note: "" },
  });

  useEffect(() => {
    if (extractedText) {
      reset({ text: extractedText, note: "" });
    }
  }, [extractedText, reset]);

  const onSubmit = async (values: FormValues) => {
    await saveGalpiMutation.mutateAsync({ text: values.text, note: values.note || undefined });
    toast.success("갈피를 남겼습니다.");
    setExtractedText(null);
    setSelectedImageSrc(null);
    router.push("/");
  };

  return (
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

      <div className="flex flex-col gap-y-2 items-center justify-center">
        <div className="w-full text-start">
          <h3 className="text-galpi-heading font-ridi">출처(선택)</h3>
          <p className="text-galpi-caption">어떤 책에서 찾은 문장이신가요? ISBN 또는 책 이름으로 검색해보세요.</p>
        </div>

        <div className="text-galpi-caption font-ridi w-full ">
          <span className="text-black">
            저자 {"<"}책이름{">"} ... 중에서
          </span>
        </div>

        <Button variant="outline" className="w-full" type="button">
          <MagnifyingGlassIcon />
          <span>출처 찾아보기</span>
        </Button>
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
  );
}
