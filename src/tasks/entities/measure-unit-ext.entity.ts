import { Prisma } from '@prisma/client';
import { OutcomeMeasureUnitExtInclude } from './outcome-measure-unit-ext.entity';

export const MeasureUnitExtInclude: Prisma.MeasureUnitInclude = {
  outcomeChildren: {
    include: OutcomeMeasureUnitExtInclude,
  },
  outcomeMeasureUnits: {
    include: OutcomeMeasureUnitExtInclude,
  },
};

const extended = Prisma.validator<Prisma.MeasureUnitArgs>()({
  include: MeasureUnitExtInclude,
});

export type MeasureUnitExt = Prisma.MeasureUnitGetPayload<typeof extended>;
