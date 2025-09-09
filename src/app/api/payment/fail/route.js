import { NextResponse } from "next/server";

export async function POST() {
  return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/fail`);
}
