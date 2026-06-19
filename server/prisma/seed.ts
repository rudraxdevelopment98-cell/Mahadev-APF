import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('ChangeMe123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@mahadevapf.com' },
    update: {},
    create: {
      email: 'admin@mahadevapf.com',
      name: 'Platform Admin',
      role: Role.ADMIN,
      passwordHash,
    },
  });

  const category = await prisma.category.upsert({
    where: { slug: 'heavy-fabrication' },
    update: {},
    create: { name: 'Heavy Fabrication', slug: 'heavy-fabrication' },
  });

  await prisma.product.upsert({
    where: { slug: 'structural-steel-systems' },
    update: {},
    create: {
      slug: 'structural-steel-systems',
      title: 'Structural Steel Systems',
      blurb: 'Pre-engineered structural assemblies machined to micron tolerances.',
      description:
        'Structural steel systems engineered for the most demanding load cases in modern infrastructure.',
      categoryId: category.id,
      leadTime: '6-10 weeks',
      stock: 50,
      features: ['BIM-modelled connections', 'Robotic welding'],
      gallery: ['Assembly', 'Detail'],
      specs: [
        { label: 'Material grade', value: 'S355 / IS 2062 E350' },
        { label: 'Max span', value: 'Up to 120 m' },
      ],
    },
  });

  // eslint-disable-next-line no-console
  console.log(`Seeded admin ${admin.email} and sample catalogue.`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
