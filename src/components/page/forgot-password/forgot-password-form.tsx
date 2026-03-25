"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/shadcn/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { useForgotPassword } from "@/hooks/page/forgot-password/use-forgot-password";

const schema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const { forgotPasswordMutation } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    await forgotPasswordMutation.mutateAsync(values);
  };

  if (forgotPasswordMutation.isSuccess) {
    return (
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-lg font-semibold">이메일을 확인해주세요</h1>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{forgotPasswordMutation.variables?.email}</span>로 비밀번호
          재설정 링크를 보냈습니다.
        </p>
        <Link href="/sign-in" className="block text-xs text-muted-foreground underline-offset-4 hover:underline">
          로그인으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">비밀번호 찾기</h1>
        <p className="text-xs text-muted-foreground">가입한 이메일 주소를 입력하시면 재설정 링크를 보내드립니다.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">이메일</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>
        </FieldGroup>

        {forgotPasswordMutation.isError && <FieldError>{forgotPasswordMutation.error.message}</FieldError>}

        <Button type="submit" className="w-full" disabled={forgotPasswordMutation.isPending}>
          {forgotPasswordMutation.isPending ? "전송 중..." : "재설정 링크 보내기"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        <Link href="/sign-in" className="text-foreground underline-offset-4 hover:underline">
          로그인으로 돌아가기
        </Link>
      </p>
    </div>
  );
}
