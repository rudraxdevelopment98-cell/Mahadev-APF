import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Temporary diagnostic. Visit /api/diag?key=setup-mahadev-2026 to run the exact
// queries the invoice pages use and report the first real error. Remove after.
const KEY = "setup-mahadev-2026";

async function step<T>(name: string, fn: () => Promise<T>) {
  try {
    const v = await fn();
    const count = Array.isArray(v) ? v.length : v ? 1 : 0;
    return { name, ok: true, count };
  } catch (e) {
    return { name, ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function GET(req: Request) {
  if (new URL(req.url).searchParams.get("key") !== KEY) {
    return NextResponse.json({ ok: false, error: "bad key" }, { status: 401 });
  }

  const results = [];

  results.push(
    await step("invoice.findMany(list)", () =>
      prisma.invoice.findMany({
        orderBy: { createdAt: "desc" },
        include: { payments: { select: { amount: true } } },
        take: 5,
      }),
    ),
  );

  results.push(
    await step("invoice.findFirst(full include)", () =>
      prisma.invoice.findFirst({
        include: { items: true, payments: { orderBy: { date: "desc" } } },
      }),
    ),
  );

  results.push(
    await step("estimates query (new invoice page)", () =>
      prisma.invoice.findMany({
        where: { type: "ESTIMATE", status: { not: "CANCELLED" } },
        orderBy: { date: "desc" },
        take: 5,
        select: {
          id: true,
          number: true,
          billName: true,
          discount: true,
          discountType: true,
          items: { select: { description: true } },
        },
      }),
    ),
  );

  results.push(
    await step("customer.findMany", () =>
      prisma.customer.findMany({ take: 5 }),
    ),
  );

  results.push(
    await step("material.findMany", () =>
      prisma.material.findMany({ where: { isActive: true }, take: 5 }),
    ),
  );

  results.push(
    await step("siteSetting.findUnique", () =>
      prisma.siteSetting.findUnique({ where: { id: 1 } }),
    ),
  );

  return NextResponse.json({ ok: true, results });
}
