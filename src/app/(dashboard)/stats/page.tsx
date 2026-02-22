import { KPISection } from "@/components/features/stats/KPISection";
import { StatsCharts } from "@/components/features/stats/StatsCharts";
import { StatsPageLoader } from "@/components/features/stats/StatsPageLoader";

export default function StatsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <StatsPageLoader />
      <h1 className="text-xl font-semibold text-foreground">Ramadan Stats</h1>
      <KPISection />
      <StatsCharts />
    </div>
  );
}
