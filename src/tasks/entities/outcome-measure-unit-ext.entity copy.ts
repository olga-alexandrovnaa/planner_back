import { Prisma } from '@prisma/client';

export const OutcomeMeasureUnitExtInclude: Prisma.OutcomeMeasureUnitInclude = {
  measureUnit: true,
};

const extended = Prisma.validator<Prisma.OutcomeMeasureUnitArgs>()({
  include: OutcomeMeasureUnitExtInclude,
});

export type OutcomeMeasureUnitExt = Prisma.OutcomeMeasureUnitGetPayload<typeof extended>;
