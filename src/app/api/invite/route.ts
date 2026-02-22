import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Server configuration error: invite not available." },
      { status: 500 }
    );
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const origin = request.headers.get("origin") ?? request.headers.get("referer")?.replace(/\/[^/]*$/, "") ?? "";
  const redirectTo = origin
    ? `${origin}/auth/callback?next=/onboarding`
    : undefined;

  const supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    email,
    { redirectTo }
  );

  if (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to send invite." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Invite sent.",
    user_id: data?.user?.id,
  });
}
