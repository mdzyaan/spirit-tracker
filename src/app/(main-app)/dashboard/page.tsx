import { HomeDashboard } from "@/components/features/home/HomeDashboard";

export default function HomePage() {
  return (
    <div className="w-full min-h-full flex justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-2xl flex flex-col gap-8 md:gap-10">
        <HomeDashboard />
      </div>
    </div>
  );
}
