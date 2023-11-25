import { PrismaClient } from '@prisma/client';
import { Seeder } from './seeders/Seeder';
import { MeasureUnits } from './seeders/data/MeasureUnits';
import { OutcomeMeasureUnits } from './seeders/data/OutcomeMeasureUnits';
import { ProductTypes } from './seeders/data/ProductTypes';

export class AllSeeders extends Seeder {
  static async seed(prisma: PrismaClient) {
    await prisma.user.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'test',
        userName: 'test',
      },
    });

    for (const iterator of ProductTypes) {
      await prisma.productType.upsert({
        where: { id: iterator.id },
        update: {},
        create: {
          ...iterator,
        },
      });
    }

    for (const iterator of MeasureUnits) {
      await prisma.measureUnit.upsert({
        where: { id: iterator.id },
        update: {},
        create: {
          ...iterator,
        },
      });
    }

    for (const iterator of OutcomeMeasureUnits) {
      await prisma.outcomeMeasureUnit.upsert({
        where: { id: iterator.id },
        update: {},
        create: {
          ...iterator,
        },
      });
    }
  }
}
