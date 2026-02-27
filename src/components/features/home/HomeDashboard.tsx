"use client";

import { GreetingHeader } from "@/components/features/home/GreetingHeader";
import { AyahCard } from "@/components/features/home/AyahCard";
import { TodayLoggingCardWithGender } from "@/components/features/home/TodayLoggingCard";

export function HomeDashboard() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <GreetingHeader />
      
      <TodayLoggingCardWithGender />
      <AyahCard />
    </div>
  );
}
