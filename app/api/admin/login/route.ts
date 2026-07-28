import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, createAdminSessionValue } from "@/lib/adminAuth";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const password = String(formData?.get("password") ?? "");

  if (!env.ADMIN_PASSWORD_HASH || !env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ message: "Faltan credenciales de administración." }, { status: 503 });
  }

  const passwordMatches = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);

  if (!passwordMatches) {
    return NextResponse.redirect(new URL("/admin?error=1", request.url), { status: 303 });
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
