import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { destroySession } from "@/lib/session";

export async function POST(request: Request) {
  await destroySession();
  revalidatePath("/", "layout"); // clear cached per-user segments on sign-out
  // 303 so the POST becomes a GET to the login page.
  return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
}
