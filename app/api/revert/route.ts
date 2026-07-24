import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// One-time down-migration: restore the original single-business Mahadev schema
// after the multi-tenant (RudrOne) experiment. Visit once:
//   /api/revert?key=revert-mahadev-2026
// Idempotent and safe to re-open. Preserves Mahadev's data; removes any other
// businesses that were created. Delete this route after it has run once.
export const dynamic = "force-dynamic";

const KEY = "revert-mahadev-2026";

const SQL = `DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Customer' AND column_name='tenantId') THEN
    -- 1) Drop any other businesses' data (keep only the primary Mahadev business).
    DELETE FROM "Invoice"     WHERE "tenantId" <> 'tenant_mahadev';
    DELETE FROM "Customer"    WHERE "tenantId" <> 'tenant_mahadev';
    DELETE FROM "Material"    WHERE "tenantId" <> 'tenant_mahadev';
    DELETE FROM "Service"     WHERE "tenantId" <> 'tenant_mahadev';
    DELETE FROM "GalleryItem" WHERE "tenantId" <> 'tenant_mahadev';
    DELETE FROM "Review"      WHERE "tenantId" <> 'tenant_mahadev';
    DELETE FROM "Space"       WHERE "tenantId" <> 'tenant_mahadev';
    DELETE FROM "Lead"        WHERE "tenantId" <> 'tenant_mahadev';
    DELETE FROM "User"        WHERE "tenantId" <> 'tenant_mahadev';

    -- 2) Restore SiteSetting to the original singleton (id = 1), keeping content.
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='SiteSetting' AND column_name='id') THEN
      DELETE FROM "SiteSetting" WHERE "tenantId" IS DISTINCT FROM 'tenant_mahadev';
      ALTER TABLE "SiteSetting" ADD COLUMN "id" INTEGER;
      UPDATE "SiteSetting" SET "id" = 1;
      ALTER TABLE "SiteSetting" DROP CONSTRAINT IF EXISTS "SiteSetting_pkey";
      ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id");
      ALTER TABLE "SiteSetting" ALTER COLUMN "id" SET DEFAULT 1;
      ALTER TABLE "SiteSetting" DROP COLUMN IF EXISTS "tenantId";
    END IF;

    -- 3) Drop the multi-tenant columns + table -> back to the original schema.
    ALTER TABLE "User"        DROP COLUMN IF EXISTS "tenantId";
    ALTER TABLE "Customer"    DROP COLUMN IF EXISTS "tenantId";
    ALTER TABLE "Material"    DROP COLUMN IF EXISTS "tenantId";
    ALTER TABLE "Invoice"     DROP COLUMN IF EXISTS "tenantId";
    ALTER TABLE "Service"     DROP COLUMN IF EXISTS "tenantId";
    ALTER TABLE "GalleryItem" DROP COLUMN IF EXISTS "tenantId";
    ALTER TABLE "Review"      DROP COLUMN IF EXISTS "tenantId";
    ALTER TABLE "Space"       DROP COLUMN IF EXISTS "tenantId";
    ALTER TABLE "Lead"        DROP COLUMN IF EXISTS "tenantId";
    DROP TABLE IF EXISTS "Tenant";
  END IF;
END $$;`;

export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key");
  if (key !== KEY) {
    return NextResponse.json({ ok: false, error: "Invalid or missing key." }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not set." }, { status: 500 });
  }
  try {
    await prisma.$executeRawUnsafe(SQL);
    const customers = await prisma.customer.count();
    return NextResponse.json({
      ok: true,
      message:
        "Reverted to the original single-business Mahadev site. Multi-tenant schema removed; your data was preserved.",
      customers,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
