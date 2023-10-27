import { Prisma } from '@prisma/client';

export const TaskExtInclude: Prisma.TaskInclude = {
  ingredients: {
    include: {
      measureUnit: true,
      product: {
        include: {
          type: true,
          measureUnit: true,
        },
      },
    },
  },
  repeatDays: true,
  repeatIfYearIntervalDays: true,
};

const extended = Prisma.validator<Prisma.TaskArgs>()({
  include: TaskExtInclude,
});

export type TaskExt = Prisma.TaskGetPayload<typeof extended>;
