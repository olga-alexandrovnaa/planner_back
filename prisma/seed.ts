import { PrismaClient } from '@prisma/client';
import { AllSeeders } from './seeders.seeder';

const prisma = new PrismaClient();

const seeders = [AllSeeders];

async function main() {
  for (const seeder of seeders) {
    const t = Date.now();
    await seeder.seed(prisma);
    console.log(`[+] ${seeder.name} (+${Date.now() - t}ms)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
