import { Prisma } from '@prisma/client';
import { IngredientExtInclude } from './ingredient-ext.entity';

export const TaskExtInclude: Prisma.TaskInclude = {
  ingredients: {
    include: IngredientExtInclude,
  },
  repeatDays: true,
  repeatIfYearIntervalDays: true,
};

const extended = Prisma.validator<Prisma.TaskArgs>()({
  include: TaskExtInclude,
});

export type TaskExt = Prisma.TaskGetPayload<typeof extended>;
