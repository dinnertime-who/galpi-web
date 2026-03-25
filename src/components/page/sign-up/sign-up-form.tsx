"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { GoogleLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/shadcn/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Separator } from "@/components/shadcn/separator";
import { useSignUp } from "@/hooks/page/sign-up/use-sign-up";

const schema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

type FormValues = z.infer<typeof schema>;

export function SignUpForm() {
  const router = useRouter();
  const { signUpMutation, signUpWithGoogle } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    await signUpMutation.mutateAsync(values);
    router.push("/");
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">회원가입</h1>
        <p className="text-xs text-muted-foreground">갈피를 시작해보세요.</p>
      </div>

      <Button variant="outline" className="w-full" onClick={signUpWithGoogle} disabled={signUpMutation.isPending}>
        <GoogleLogo weight="bold" />
        Google로 계속하기
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">또는</span>
        <Separator className="flex-1" />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">이름</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="홍길동"
              autoComplete="name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

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

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">비밀번호</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <FieldError errors={[errors.password]} />
          </Field>
        </FieldGroup>

        {signUpMutation.isError && <FieldError>{signUpMutation.error.message}</FieldError>}

        <Button type="submit" className="w-full" disabled={signUpMutation.isPending}>
          {signUpMutation.isPending ? "가입 중..." : "회원가입"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/sign-in" className="text-foreground underline-offset-4 hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
