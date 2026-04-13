import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Get user profile to determine redirect
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        // Redirect based on role
        if (profile?.role === "laveur") {
          // Check if laveur profile exists
          const { data: laveurProfile } = await supabase
            .from("laveur_profiles")
            .select("id")
            .eq("user_id", user.id)
            .single();

          if (!laveurProfile) {
            return NextResponse.redirect(
              new URL("/onboarding/laveur", origin)
            );
          }
        }

        return NextResponse.redirect(new URL(redirect, origin));
      }
    }
  }

  // Auth error — redirect to connexion with error
  return NextResponse.redirect(new URL("/connexion?error=auth", origin));
}
