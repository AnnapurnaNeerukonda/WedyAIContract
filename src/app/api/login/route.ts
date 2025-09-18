import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const VALID_USERS = new Set([
  "photographer@test.com",
  "caterer@test.com",
  "florist@test.com",
]);
const PASSWORD = "password123";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ message: "Email and password required" }, { status: 400 });
  }
  if (!VALID_USERS.has(email) || password !== PASSWORD) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }
  const cookieStore = await cookies();
  cookieStore.set("session", JSON.stringify({ email }), {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return NextResponse.json({ ok: true });
}


