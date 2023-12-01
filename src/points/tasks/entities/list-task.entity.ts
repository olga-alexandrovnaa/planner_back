import { FoodType, IntervalType } from '@prisma/client';

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

  foodId: number | null;
  food: {
    id: number;
    name: string;
    proteins: number | null;
    fats: number | null;
    carbohydrates: number | null;
    calories: number | null;
    foodType: FoodType | null;
  } | null;
  foodCountToPrepare: number | null;
  foodCout: number | null;
};
