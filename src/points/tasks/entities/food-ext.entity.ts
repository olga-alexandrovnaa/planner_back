import { Prisma } from '@prisma/client';
import { RecipeStepExtInclude } from '../../products/entities/recipe-step-ext.entity';

export const FoodExtInclude: Prisma.FoodInclude = {
  recipeSteps: {
    include: RecipeStepExtInclude,
  },
};

const extended = Prisma.validator<Prisma.FoodArgs>()({
  include: FoodExtInclude,
});

export type FoodExt = Prisma.FoodGetPayload<typeof extended>;
