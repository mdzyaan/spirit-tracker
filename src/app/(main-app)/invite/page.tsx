import { InviteForm } from "@/components/features/invite/InviteForm";

export default function InvitePage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-semibold text-foreground mb-4">Invite user</h1>
      <InviteForm />
    </div>
  );
}
