import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { siteSettingSchema } from "@/lib/validations";

export async function GET() {
  const auth = await requireAuth();
  if (auth) return auth;

  try {
    const items = await prisma.siteSetting.findMany();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;

  try {
    const body = await request.json();
    const parsed = siteSettingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { key, value } = parsed.data;
    const existing = await prisma.siteSetting.findUnique({ where: { key } });
    if (existing) {
      const updated = await prisma.siteSetting.update({ where: { key }, data: { value } });
      return NextResponse.json(updated);
    }
    const created = await prisma.siteSetting.create({ data: { key, value } });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to upsert setting" }, { status: 500 });
  }
}
