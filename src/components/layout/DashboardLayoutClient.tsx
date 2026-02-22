"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "@/services/auth.service";
import { useAppSelector } from "@/store/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const user = useAppSelector((s) => s.auth.user);
  const session = useAppSelector((s) => s.auth.session);
  const displayName = user?.name?.trim() || null;
  const email = session?.user?.email ?? "";

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const triggerLabel = displayName
    ? email
      ? `${displayName} | ${email}`
      : displayName
    : email || "Account";

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground h-auto py-2"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={user?.avatar_url ?? undefined} alt="" />
                <AvatarFallback className="text-xs">
                  {displayName
                    ? displayName.slice(0, 2).toUpperCase()
                    : email
                      ? email.slice(0, 2).toUpperCase()
                      : "?"}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0 truncate text-left text-sm">{triggerLabel}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/profile">My profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </aside>
      <main className="max-h-[100dvh]  w-full overflow-x-hidden overflow-y-auto">{children}</main>
    </div>
  );
}
