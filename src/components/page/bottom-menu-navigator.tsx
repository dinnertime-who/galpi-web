"use client";

import { BookmarkIcon, BooksIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    href: "/",
    icon: BookmarkIcon,
    label: "갈피",
    isActive: (pathname: string) => pathname === "/" || pathname === "/record",
  },
  {
    href: "/bookshelf",
    icon: BooksIcon,
    label: "책장",
    isActive: (pathname: string) => pathname === "/bookshelf",
  },
];

export function BottomMenuNavigator({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex items-center justify-between bg-(--galpi-primary-background) border-t border-border",
        className,
      )}
    >
      {menuItems.map((item) => (
        <div className="flex-1 flex items-center justify-center" key={item.href}>
          <Link
            href={item.href}
            className={cn(
              "flex flex-col gap-y-1 items-center justify-center w-max text-galpi-text-secondary",
              "data-[active=true]:font-bold data-[active=true]:text-galpi-text-primary",
            )}
            data-active={item.isActive(pathname)}
          >
            <item.icon className="size-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}
