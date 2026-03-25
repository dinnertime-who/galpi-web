import type { Metadata } from "next";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ViewTransition } from "react";
import { Toaster } from "@/components/shadcn/sonner";
import { TooltipProvider } from "@/components/shadcn/tooltip";
import { Pretendard, Ridi } from "@/config/fonts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/config/site";
import { TanstackQueryProvider } from "@/integrations/tanstack-query/provider";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s - ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn(Pretendard.variable, Ridi.variable, "font-pretendard")}>
      <body className="antialiased">
        <TooltipProvider>
          <TanstackQueryProvider>
            <NuqsAdapter>
              <ViewTransition>{children}</ViewTransition>
              <Toaster />
            </NuqsAdapter>
          </TanstackQueryProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
