import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin user ---
  const email = "admin@mahadevapf.com";
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, name: "Shop Owner", role: "ADMIN" },
  });
  console.log(`Admin ready -> ${email} / admin123`);

  // --- Rate list (materials + work) ---
  const materials = [
    { name: "Aluminium Sliding Window (2 track)", category: "ALUMINIUM", kind: "WORK", unit: "sqft", hsn: "7610", rate: 420, taxRate: 18 },
    { name: "Aluminium Openable Window", category: "ALUMINIUM", kind: "WORK", unit: "sqft", hsn: "7610", rate: 520, taxRate: 18 },
    { name: "uPVC Sliding Window", category: "UPVC", kind: "WORK", unit: "sqft", hsn: "3925", rate: 650, taxRate: 18 },
    { name: "uPVC Casement Door", category: "UPVC", kind: "WORK", unit: "sqft", hsn: "3925", rate: 780, taxRate: 18 },
    { name: "Modular Wardrobe (laminate finish)", category: "FURNITURE", kind: "WORK", unit: "sqft", hsn: "9403", rate: 1350, taxRate: 18 },
    { name: "Modular Kitchen (base + loft)", category: "FURNITURE", kind: "WORK", unit: "sqft", hsn: "9403", rate: 1650, taxRate: 18 },
    { name: "Toughened Glass 8mm", category: "GLASS", kind: "MATERIAL", unit: "sqft", hsn: "7007", rate: 95, taxRate: 18 },
    { name: "Glass Partition with framing", category: "GLASS", kind: "WORK", unit: "sqft", hsn: "7007", rate: 320, taxRate: 18 },
    { name: "Mosquito Net (SS mesh)", category: "ALUMINIUM", kind: "MATERIAL", unit: "sqft", hsn: "7314", rate: 85, taxRate: 18 },
    { name: "Installation & Fitting Charges", category: "OTHER", kind: "WORK", unit: "job", hsn: "9954", rate: 1500, taxRate: 18 },
  ];
  for (const m of materials) {
    const existing = await prisma.material.findFirst({ where: { name: m.name } });
    if (!existing) await prisma.material.create({ data: m });
  }
  console.log(`Seeded ${materials.length} rate-list items`);

  // --- A sample customer ---
  const sample = await prisma.customer.findFirst({ where: { phone: "9876543210" } });
  if (!sample) {
    await prisma.customer.create({
      data: {
        name: "Rajesh Patel",
        phone: "9876543210",
        email: "rajesh@example.com",
        address: "12, Shivam Bungalows, Satellite, Ahmedabad",
      },
    });
    console.log("Seeded sample customer");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
