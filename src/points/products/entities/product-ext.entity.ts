import { Prisma } from '@prisma/client';

export const ProductExtInclude: Prisma.ProductInclude = {
  type: true,
  measureUnit: true,
};

const extended = Prisma.validator<Prisma.ProductArgs>()({
  include: ProductExtInclude,
});

export type ProductExt = Prisma.ProductGetPayload<typeof extended>;
