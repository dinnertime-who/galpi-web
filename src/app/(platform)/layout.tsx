import { BottomMenuNavigator } from "@/components/page/bottom-menu-navigator";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:max-w-md mx-auto shadow-lg bg-background min-h-svh relative">
      <main className="">{children}</main>
      <BottomMenuNavigator className="absolute bottom-0 left-0 right-0 h-16" />
    </div>
  );
}
