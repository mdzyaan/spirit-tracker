"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-full">
      <SidebarProvider className="flex-1 !min-h-0 overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0 bg-background overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto bg-background md:rounded-tl-xl no-scrollbar">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
