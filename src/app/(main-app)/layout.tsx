import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/AppShell";

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: settings } = await supabase
    .from("user_settings")
    .select("gender, latitude, longitude, country")
    .eq("user_id", user.id)
    .maybeSingle();

  const isComplete =
    !!settings?.gender &&
    (!!settings?.country || settings?.latitude != null);

  if (!isComplete) {
    redirect("/onboarding");
  }

  return <AppShell>{children}</AppShell>;
}
