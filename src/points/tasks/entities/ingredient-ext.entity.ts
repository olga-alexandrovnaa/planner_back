import { Prisma } from '@prisma/client';
import { ProductExtInclude } from './product-ext.entity';

export const IngredientExtInclude: Prisma.IngredientInclude = {
  measureUnit: true,
  product: {
    include: ProductExtInclude,
  },
};

const extended = Prisma.validator<Prisma.IngredientArgs>()({
  include: IngredientExtInclude,
});

export type IngredientExt = Prisma.IngredientGetPayload<typeof extended>;
