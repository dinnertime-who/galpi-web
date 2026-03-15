import { BottomMenuNavigator } from "@/components/page/bottom-menu-navigator";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:max-w-md mx-auto shadow-lg bg-background min-h-svh relative pb-16">
      <main className="">{children}</main>
      <BottomMenuNavigator className="fixed bottom-0 sm:max-w-md mx-auto w-full h-16" />
    </div>
  );
}
