"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden w-56 shrink-0 border-r border-hairline p-5 md:block">
      <ul className="space-y-1">
        {ITEMS.map((it) => {
          const active =
            it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ion/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void",
                  active
                    ? "bg-white/[0.06] text-starlight"
                    : "text-dust hover:bg-white/[0.03] hover:text-starlight",
                )}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
