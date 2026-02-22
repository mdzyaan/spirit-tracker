"use client";

import Image from "next/image";

export function DashboardHeader() {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="relative w-10 h-10 shrink-0">
        <Image
          src="/assets/lantern-colored.png"
          alt=""
          width={40}
          height={40}
          className="object-contain"
          unoptimized
        />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Ramadan Tracker
        </h1>
        {/* {status === "loading" && (
          <div className="flex items-center gap-2 mt-0.5 text-sm text-muted-foreground">
            <Loader size="sm" />
            <span>Loading…</span>
          </div>
        )} */}
      </div>
    </div>
  );
}
