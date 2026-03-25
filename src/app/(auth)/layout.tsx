import { BottomMenuNavigator } from "@/components/page/bottom-menu-navigator";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:max-w-md mx-auto shadow-lg bg-background relative">
      <main className="pb-16 min-h-svh flex flex-col items-center justify-center">{children}</main>
      <BottomMenuNavigator className="fixed bottom-0 sm:max-w-md mx-auto w-full h-16" />
    </div>
  );
}
