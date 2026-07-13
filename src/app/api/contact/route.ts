import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(200),
  phone: z.string().max(20).optional().or(z.literal("")),
  date: z.string().max(20).optional().or(z.literal("")),
  eventType: z.string().max(50).optional().or(z.literal("")),
  message: z.string().min(1, "Message is required").max(2000),
});

const submissions = new Map<string, number[]>();
const RATE_LIMIT = 5;
const WINDOW = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = (submissions.get(ip) || []).filter((t) => now - t < WINDOW);
  submissions.set(ip, times);
  return times.length >= RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, email, phone, date, eventType, message } = parsed.data;

    submissions.get(ip)?.push(Date.now());

    const submission = await prisma.contactSubmission.create({
      data: { name, email, phone: phone || null, date: date || null, eventType: eventType || null, message },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 });
  }
}
