import { PrismaClient } from '@prisma/client';

export class Seeder {
  static seed: (prisma: PrismaClient) => Promise<any>;
}