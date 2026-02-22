"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "@/services/auth.service";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/stats", label: "Stats" },
  { href: "/settings", label: "Settings" },
];

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <aside className="w-full md:w-56 border-b md:border-b-0 md:border-r border-border bg-card p-4 flex flex-col">
        <Link href="/" className="font-semibold text-foreground block mb-6">
          Ramadan Tracker
        </Link>
        <nav className="flex flex-row md:flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                className={cn("w-full justify-start")}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={handleSignOut}
        >
          Sign out
        </Button>
      </aside>
      <main className="max-h-[100dvh]  w-full overflow-x-hidden overflow-y-auto">{children}</main>
    </div>
  );
}
