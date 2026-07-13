import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { aboutSectionSchema } from "@/lib/validations";

export async function GET() {
  try {
    const item = await prisma.aboutSection.findFirst();
    return NextResponse.json(item || null);
  } catch {
    return NextResponse.json({ error: "Failed to fetch about section" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;

  try {
    const body = await request.json();
    const parsed = aboutSectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const existing = await prisma.aboutSection.findFirst();
    if (existing) {
      const updated = await prisma.aboutSection.update({ where: { id: existing.id }, data: parsed.data });
      return NextResponse.json(updated);
    }
    const created = await prisma.aboutSection.create({ data: parsed.data });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to upsert about section" }, { status: 500 });
  }
}
