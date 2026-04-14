import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SUPABASE_URL ? "https://www.pingwash.com" : "http://localhost:3000"), {
    status: 302,
  });
}

export async function GET(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const { origin } = new URL(request.url);
  return NextResponse.redirect(new URL("/", origin), {
    status: 302,
  });
}
