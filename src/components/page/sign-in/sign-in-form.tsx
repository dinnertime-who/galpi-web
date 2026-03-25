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
import { useSignIn } from "@/hooks/page/sign-in/use-sign-in";

const schema = z.object({
  email: z.email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

type FormValues = z.infer<typeof schema>;

export function SignInForm() {
  const router = useRouter();
  const { signInMutation, signInWithGoogle } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    await signInMutation.mutateAsync(values);
    router.push("/");
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">로그인</h1>
        <p className="text-xs text-muted-foreground">갈피에 오신 것을 환영합니다.</p>
      </div>

      <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={signInMutation.isPending}>
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
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">비밀번호</FieldLabel>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
              >
                비밀번호 찾기
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <FieldError errors={[errors.password]} />
          </Field>
        </FieldGroup>

        {signInMutation.isError && <FieldError>{signInMutation.error.message}</FieldError>}

        <Button type="submit" className="w-full" disabled={signInMutation.isPending}>
          {signInMutation.isPending ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        계정이 없으신가요?{" "}
        <Link href="/sign-up" className="text-foreground underline-offset-4 hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
