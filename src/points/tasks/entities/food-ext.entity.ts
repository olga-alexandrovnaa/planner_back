import { Prisma } from '@prisma/client';
import { IngredientExtInclude } from './ingredient-ext.entity';

export const FoodExtInclude: Prisma.FoodInclude = {
  ingredients: {
    include: IngredientExtInclude,
  },
};

const extended = Prisma.validator<Prisma.FoodArgs>()({
  include: FoodExtInclude,
});

export type FoodExt = Prisma.FoodGetPayload<typeof extended>;
