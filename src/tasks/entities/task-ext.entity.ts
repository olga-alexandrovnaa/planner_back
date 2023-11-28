import { Prisma } from '@prisma/client';

export const TaskExtInclude: Prisma.TaskInclude = {
  repeatDays: true,
  repeatIfYearIntervalDays: true,
  taskRepeatDayCheck: true,
  incomeType: true,
  outcomeType: true,
  taskBuyings: {
    include: {
      buying: true,
    },
  },
  food: {
    include: {
      ingredients: {
        include: {
          measureUnit: true,
          product: true,
        },
      },
    },
  },
};

const extended = Prisma.validator<Prisma.TaskArgs>()({
  include: TaskExtInclude,
});

export type TaskExt = Prisma.TaskGetPayload<typeof extended>;
