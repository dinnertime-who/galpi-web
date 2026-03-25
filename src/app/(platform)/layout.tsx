import { BottomMenuNavigator } from "@/components/page/bottom-menu-navigator";
import { PWAInstall } from "@/components/ui/pwa-install";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:max-w-md mx-auto shadow-lg bg-background relative">
      <div className="fixed top-0 sm:max-w-md mx-auto w-full h-16 z-10">
        <PWAInstall />
      </div>
      <main className="pb-16 pt-16 min-h-svh">{children}</main>
      <BottomMenuNavigator className="fixed bottom-0 sm:max-w-md mx-auto w-full h-16" />
    </div>
  );
}
