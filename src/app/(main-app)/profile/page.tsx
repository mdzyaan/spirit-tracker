import { ProfileForm } from "@/components/features/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-semibold text-foreground mb-4">My profile</h1>
      <ProfileForm />
    </div>
  );
}
