import { IntervalType } from '@prisma/client';

export type ListTask = {
  id: number;
  name: string;
  isTracker: boolean;
  intervalPart: IntervalType | null;
  intervalLength: number | null;
  repeatCount: number | null;
  moneyIncome: number | null;
  moneyOutcome: number | null;
  isFood: boolean;
  checked: boolean;
  deadline: string | null;
};
