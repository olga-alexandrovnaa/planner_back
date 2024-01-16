import { Prisma } from '@prisma/client';
import { IngredientExtInclude } from './ingredient-ext.entity';

export const RecipeStepExtInclude: Prisma.RecipeStepInclude = {
  food: true,
  ingredients: {
    include: IngredientExtInclude,
  },
};

const extended = Prisma.validator<Prisma.RecipeStepArgs>()({
  include: RecipeStepExtInclude,
});

export type RecipeStepExt = Prisma.RecipeStepGetPayload<typeof extended>;
