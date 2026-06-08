import { NextResponse } from "next/server";
import { PULSE_ITEMS } from "@/lib/pulse-data";

export const revalidate = 60;

export async function GET() {
  return NextResponse.json({ data: PULSE_ITEMS });
}
