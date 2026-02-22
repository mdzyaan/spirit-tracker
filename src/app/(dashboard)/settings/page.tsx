import { SettingsForm } from "@/components/features/settings/SettingsForm";

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-semibold text-foreground mb-4">Settings</h1>
      <SettingsForm />
    </div>
  );
}
