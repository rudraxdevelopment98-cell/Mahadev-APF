-- ============================================================================
--  Mahadev APF — one-time database setup for Neon / Postgres.
--  Paste this whole file into the Neon SQL Editor and click "Run".
--  Safe to run more than once.
-- ============================================================================

-- ---------- Tables ----------
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "gstin" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Material" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "kind" TEXT NOT NULL DEFAULT 'MATERIAL',
    "unit" TEXT NOT NULL DEFAULT 'nos',
    "hsn" TEXT,
    "rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 18,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Invoice" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TAX',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ISSUED',
    "customerId" TEXT,
    "billName" TEXT NOT NULL,
    "billPhone" TEXT,
    "billGstin" TEXT,
    "billAddress" TEXT,
    "interState" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "subTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "grandTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "InvoiceItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hsn" TEXT,
    "unit" TEXT NOT NULL DEFAULT 'nos',
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'CASH',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SiteSetting" (
    "id" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Other',
    "blurb" TEXT NOT NULL,
    "points" JSONB NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GalleryItem" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "category" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- Newer invoice columns (safe on existing tables)
ALTER TABLE "Invoice" ADD COLUMN IF NOT EXISTS "discountType" TEXT NOT NULL DEFAULT 'AMOUNT';
ALTER TABLE "Invoice" ADD COLUMN IF NOT EXISTS "roundOff" DOUBLE PRECISION NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "quote" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "message" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'website',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- ---------- Indexes ----------
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Invoice_number_key" ON "Invoice"("number");
CREATE INDEX IF NOT EXISTS "Invoice_date_idx" ON "Invoice"("date");
CREATE INDEX IF NOT EXISTS "InvoiceItem_invoiceId_idx" ON "InvoiceItem"("invoiceId");
CREATE INDEX IF NOT EXISTS "Payment_invoiceId_idx" ON "Payment"("invoiceId");

-- ---------- Foreign keys (idempotent) ----------
DO $$ BEGIN
    ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey"
        FOREIGN KEY ("customerId") REFERENCES "Customer"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey"
        FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey"
        FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
--  Seed data
-- ============================================================================

-- Admin login -> admin@mahadevapf.com / admin123  (change the password later)
INSERT INTO "User" ("id","email","passwordHash","name","role")
VALUES (
  'usr_admin',
  'admin@mahadevapf.com',
  '$2b$10$m2QRs4zLkWDrL6zF.j8r.OOW0aDD42Y/cdwXZs0Jy7WpRWgyQqCpu',
  'Shop Owner',
  'ADMIN'
)
ON CONFLICT ("email") DO NOTHING;

-- Rate list (materials + work items)
INSERT INTO "Material" ("id","name","category","kind","unit","hsn","rate","taxRate","updatedAt") VALUES
  ('mat_01','Aluminium Sliding Window (2 track)','ALUMINIUM','WORK','sqft','7610',420,18,CURRENT_TIMESTAMP),
  ('mat_02','Aluminium Openable Window','ALUMINIUM','WORK','sqft','7610',520,18,CURRENT_TIMESTAMP),
  ('mat_03','uPVC Sliding Window','UPVC','WORK','sqft','3925',650,18,CURRENT_TIMESTAMP),
  ('mat_04','uPVC Casement Door','UPVC','WORK','sqft','3925',780,18,CURRENT_TIMESTAMP),
  ('mat_05','Modular Wardrobe (laminate finish)','FURNITURE','WORK','sqft','9403',1350,18,CURRENT_TIMESTAMP),
  ('mat_06','Modular Kitchen (base + loft)','FURNITURE','WORK','sqft','9403',1650,18,CURRENT_TIMESTAMP),
  ('mat_07','Toughened Glass 8mm','GLASS','MATERIAL','sqft','7007',95,18,CURRENT_TIMESTAMP),
  ('mat_08','Glass Partition with framing','GLASS','WORK','sqft','7007',320,18,CURRENT_TIMESTAMP),
  ('mat_09','Mosquito Net (SS mesh)','ALUMINIUM','MATERIAL','sqft','7314',85,18,CURRENT_TIMESTAMP),
  ('mat_10','Installation & Fitting Charges','OTHER','WORK','job','9954',1500,18,CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- A sample customer
INSERT INTO "Customer" ("id","name","phone","email","address","updatedAt") VALUES
  ('cust_sample','Rajesh Patel','9876543210','rajesh@example.com','12, Shivam Bungalows, Satellite, Ahmedabad',CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Default services (shown on the website; editable in Admin > Services)
INSERT INTO "Service" ("id","title","category","blurb","points","order","updatedAt") VALUES
  ('svc_01','Aluminium Windows & Doors','Aluminium','Sliding and openable aluminium windows and doors in powder-coated finishes, built to measure.','["Sliding / Openable / Partition","Powder coat — any shade","Clear / tinted / frosted"]',0,CURRENT_TIMESTAMP),
  ('svc_02','uPVC Windows & Doors','uPVC','Premium uPVC sliding and casement windows — sound-proof, dust-proof and weather-proof.','["Multi-chamber, steel reinforced","Sliding / Casement / Fixed","Single / double glazed"]',1,CURRENT_TIMESTAMP),
  ('svc_03','Modular Kitchens','Furniture','Custom modular kitchens with smart storage, durable finishes and quality fittings.','["BWP / BWR ply","Laminate / Acrylic / PU","Soft-close hinges & channels"]',2,CURRENT_TIMESTAMP),
  ('svc_04','Wardrobes & Storage','Furniture','Sliding and openable wardrobes, TV units and storage built to fit your room perfectly.','["Sliding / Openable","Ply / MDF with laminate","Drawers, shelves, hanging"]',3,CURRENT_TIMESTAMP),
  ('svc_05','Glass & Partitions','Glass','Toughened glass railings, shower partitions, shopfronts and office glass partitions.','["Toughened 8/10/12 mm","Shower / railing / partition","Framed / frameless"]',4,CURRENT_TIMESTAMP),
  ('svc_06','Office & Shop Interiors','Furniture','Complete interior fit-outs for offices, showrooms and shops — furniture, glass and aluminium together.','["Furniture + glass + aluminium","Offices / showrooms / shops","Cabins, counters, storage"]',5,CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
