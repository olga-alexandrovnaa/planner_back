import { Prisma } from '@prisma/client';
import { OutcomeMeasureUnitExtInclude } from './outcome-measure-unit-ext.entity copy';

export const MeasureUnitExtInclude: Prisma.MeasureUnitInclude = {
  outcomeMeasureUnits: {
    include: OutcomeMeasureUnitExtInclude,
  },
};

const extended = Prisma.validator<Prisma.MeasureUnitArgs>()({
  include: MeasureUnitExtInclude,
});

export type MeasureUnitExt = Prisma.MeasureUnitGetPayload<typeof extended>;
