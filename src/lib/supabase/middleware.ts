import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return NextResponse.next({ request });
  }

  const response = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthPage = request.nextUrl.pathname === "/login";
  const isOnboardingPage = request.nextUrl.pathname === "/onboarding";
  const isProtected =
    request.nextUrl.pathname.startsWith("/home") ||
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/stats") ||
    request.nextUrl.pathname.startsWith("/settings") ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/invite");

  if (isProtected && !session) {
    const redirect = new URL("/login", request.url);
    return NextResponse.redirect(redirect);
  }

  if (isAuthPage && session) {
    const redirect = new URL("/dashboard", request.url);
    return NextResponse.redirect(redirect);
  }

  if (isOnboardingPage && !session) {
    const redirect = new URL("/login", request.url);
    return NextResponse.redirect(redirect);
  }

  // Progressive onboarding: require completed user_settings for protected routes
  if (session && (isProtected || isOnboardingPage)) {
    const { data: settings } = await supabase
      .from("user_settings")
      .select("gender, latitude, longitude, country")
      .eq("user_id", session.user.id)
      .maybeSingle();

    const hasSettings =
      !!settings?.gender &&
      (!!settings?.country || settings?.latitude != null);

    if (isProtected && !hasSettings) {
      const redirect = new URL("/onboarding", request.url);
      return NextResponse.redirect(redirect);
    }

    if (isOnboardingPage && hasSettings) {
      const redirect = new URL("/dashboard", request.url);
      return NextResponse.redirect(redirect);
    }
  }

  return response;
}
