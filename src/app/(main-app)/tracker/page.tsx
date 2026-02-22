import { TrackerGrid } from "@/components/features/tracker/TrackerGrid";
import { DashboardHeader } from "@/components/features/tracker/DashboardHeader";
import { RamadanSettingsBanner } from "@/components/features/tracker/RamadanSettingsBanner";

export default function DashboardPage() {
  return (
    <div >
      <DashboardHeader />
      <RamadanSettingsBanner />
      <div className="w-full min-w-0">
        <TrackerGrid />
      </div>
    </div>
  );
}
