import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Food, FoodType, MeasureUnit, Prisma, ProductType, RecipeStep } from '@prisma/client';
import 'multer';
import { addDays, format, startOfDay } from 'date-fns';
import { ProductExt, ProductExtInclude } from './entities/product-ext.entity';
import { CreateFoodDto } from './dto/create-food.dto';
import { FoodExt, FoodExtInclude } from './entities/food-ext.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { MeasureUnitExt, MeasureUnitExtInclude } from './entities/measure-unit-ext.entity';
import { IngredientExt, IngredientExtInclude } from './entities/ingredient-ext.entity';
import { OutcomeMeasureUnitExtInclude } from './entities/outcome-measure-unit-ext.entity';
import { TasksService } from '../tasks/tasks.service';
import { IngregientDto } from './dto/ingredient.dto';
import { tasksType } from '../tasks/entities/task-type.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService,
  ) {}
  async foodExt(id: number): Promise<FoodExt | null> {
    try {
      const data = await this.prisma.food.findUnique({
        where: { id: id },
        include: {
          ...FoodExtInclude,
        },
      });
      return data;
    } catch {
      throw new BadRequestException();
    }
  }

  async measureUnits(): Promise<MeasureUnitExt[]> {
    try {
      const data = await this.prisma.measureUnit.findMany({
        include: MeasureUnitExtInclude,
      });
      return data.sort((a, b) => (a.name > b.name ? 1 : -1));
    } catch {
      throw new BadRequestException();
    }
  }
  async measureUnitsByIngredient(product: number): Promise<MeasureUnit[]> {
    try {
      const p = await this.prisma.product.findUnique({
        where: {
          id: product,
        },
      });
      if (!p) return [];

      const pMu = await this.prisma.measureUnit.findUnique({
        where: {
          id: p.measureUnitId,
        },
      });

      const pMuOutcome = await this.prisma.outcomeMeasureUnit.findMany({
        where: {
          parentId: p.measureUnitId,
        },
        include: OutcomeMeasureUnitExtInclude,
      });

      if (!pMu) {
        return [];
      }
      if (!pMuOutcome) {
        return [pMuOutcome];
      }

      const data = await this.prisma.measureUnit.findMany({
        where: {
          id: {
            in: pMuOutcome.map((e) => e.measureUnitId),
          },
        },
        include: MeasureUnitExtInclude,
      });

      return [pMu, ...data].sort((a, b) => (a.name > b.name ? 1 : -1));
    } catch {
      throw new BadRequestException();
    }
  }

  async productsByType(userId, type: number): Promise<ProductExt[]> {
    try {
      const data = await this.prisma.product.findMany({
        where: {
          OR: [
            {
              typeId: type,
              userId,
            },
            {
              typeId: type,
              userId: null,
            },
          ],
        },
        include: ProductExtInclude,
      });
      return data.sort((a, b) => (a.name > b.name ? 1 : -1));
    } catch {
      throw new BadRequestException();
    }
  }

  async foodOptionsByType(
    userId,
    type: FoodType,
    date: string,
  ): Promise<
    {
      label: string;
      options: {
        value: number;
        label: string;
        data: Food & {
          recipeSteps: (RecipeStep & {
            ingredients: IngredientExt[];
          })[];
        };
      }[];
    }[]
  > {
    try {
      const data: (Food & {
        recipeSteps: (RecipeStep & {
          ingredients: IngredientExt[];
        })[];
      })[] = await this.prisma.food.findMany({
        where: {
          OR: [
            {
              foodType: type,
              isDeleted: false,
              userId,
            },
            {
              foodType: type,
              isDeleted: false,
              userId: null,
            },
          ],
        },
        include: {
          recipeSteps: {
            include: {
              ingredients: {
                include: IngredientExtInclude,
              },
            },
          },
        },
      });

      const end = format(addDays(startOfDay(new Date(date)), -3), 'yyyy-MM-dd');

      const ingredients = await this.allIngredients(userId, end, date);

      const foodWithSameIngredients: (Food & {
        recipeSteps: (RecipeStep & {
          ingredients: IngredientExt[];
        })[];
      })[] = [];

      for (const iterator of data) {
        if (iterator.recipeSteps) {
          let recipeStepsIngredients: IngredientExt[] = [];
          for (const step of iterator.recipeSteps) {
            recipeStepsIngredients = [...recipeStepsIngredients, ...step.ingredients];
          }
          let count = 0;
          for (const i of recipeStepsIngredients) {
            if (!ingredients.find((e) => e.product.id === i.productId)) {
              count += 1;
              if (count > 3) break;
            }
          }
          if (count <= 3) {
            foodWithSameIngredients.push(iterator);
          }
        }
      }

      const all = {
        label: foodWithSameIngredients.length ? 'Остальное' : 'Результат',
        options: data
          .filter((e) => !foodWithSameIngredients.find((el) => el.id === e.id))
          .map((e) => ({
            value: e.id,
            label: e.name,
            data: e,
          }))
          .sort((a, b) => (a.data.name > b.data.name ? 1 : -1)),
      };

      if (foodWithSameIngredients.length) {
        return [
          {
            label: 'с ингред., добавл. за посл. 3 дня (не более 3 новых)',
            options: foodWithSameIngredients
              .map((e) => ({
                value: e.id,
                label: e.name,
                data: e,
              }))
              .sort((a, b) => (a.data.name > b.data.name ? 1 : -1)),
          },
          all,
        ];
      }

      return [all];
    } catch {
      throw new BadRequestException();
    }
  }

  async productTypes(): Promise<ProductType[]> {
    try {
      const data = await this.prisma.productType.findMany();
      return data;
    } catch {
      throw new BadRequestException();
    }
  }
  async allIngredients(
    userId: number,
    dateStart: string,
    dateEnd: string,
  ): Promise<
    {
      product: ProductExt;
      count: number;
      countInPack: number;
    }[]
  > {
    try {
      let start = startOfDay(new Date(dateStart));
      const end = startOfDay(new Date(dateEnd));

      const food: { foodId: number; count: number }[] = [];

      while (start <= end) {
        const trackers = await this.tasksService.dayTasks(userId, format(start, 'yyyy-MM-dd'), tasksType.food);

        for (const iterator of trackers) {
          if (iterator.food) {
            food.push({
              foodId: iterator.food.id,
              count: iterator.foodCountToPrepare ?? 1,
            });
          }
        }
        start = addDays(start, 1);
      }

      let ingredients: (IngredientExt & {
        product: ProductExt & {
          measureUnit: {
            id: number;
            name: string;
            outcomeChildren: {
              measureUnitId: number;
              outcomeOfProduct: number;
            }[];
          };
        };
      })[] = [];
      for (const element of food) {
        const steps = await this.prisma.recipeStep.findMany({
          where: {
            foodId: element.foodId,
          },
          include: {
            ingredients: {
              include: {
                product: {
                  include: {
                    ...ProductExtInclude,
                    measureUnit: {
                      include: {
                        outcomeChildren: true,
                      },
                    },
                  },
                },
                measureUnit: true,
                recipeStep: true,
              },
            },
          },
        });

        steps.forEach((step) => {
          for (let index = 0; index < element.count; index++) {
            ingredients = [...ingredients, ...step.ingredients];
          }
        });
      }

      const data: {
        product: ProductExt;
        count: number;
      }[] = [];

      for (const iterator of ingredients) {
        const added = data.find((e) => e.product.id === iterator.productId);

        let count: number = 0;

        if (iterator.measureUnitId === iterator.product.measureUnitId) {
          count = iterator.count;
        } else {
          const outcome = iterator.product.measureUnit.outcomeChildren.find(
            (e) => e.measureUnitId === iterator.measureUnitId,
          );

          if (outcome) count = iterator.count / outcome.outcomeOfProduct;
        }

        if (!added) {
          data.push({
            product: iterator.product,
            count: count,
          });
        } else {
          added.count += count;
        }
      }

      return data
        .map((e) => ({
          ...e,
          count: Math.ceil(e.count * 1000) / 1000,
          countInPack: e.product.count
            ? Math.ceil((Math.ceil(e.count * 1000) / (1000 * e.product.count)) * 10) / 10
            : Math.ceil(e.count * 1000) / 1000,
        }))
        .sort((a, b) => (a.product.name > b.product.name ? 1 : -1));
    } catch {
      throw new BadRequestException();
    }
  }

  async createProduct(userId: number, createProductDto: CreateProductDto): Promise<ProductExt | null> {
    try {
      return await this.prisma.product.create({
        data: {
          ...createProductDto,
          userId,
        },
        include: ProductExtInclude,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async createFood(userId: number, createFoodDto: CreateFoodDto): Promise<FoodExt | null> {
    const createdDto: Prisma.FoodCreateInput = {
      ...createFoodDto,
      user: { connect: { id: userId } },
      recipeSteps: undefined,
    };

    const created = await this.createFoodMainFields(createdDto);

    if (created && createFoodDto.recipeSteps) {
      await this.updateFoodIngredients(
        created.id,
        createFoodDto.recipeSteps.map((e) => ({
          recipe: e.recipe,
          stepNumber: e.stepNumber,
          foodId: created.id,
          ingredients: e.ingredients ?? [],
        })),
      );
    }

    return this.prisma.food.findFirst({
      where: {
        id: created.id,
      },
      include: FoodExtInclude,
    });
  }

  async updateFood(id: number, updateFoodDto: UpdateFoodDto): Promise<FoodExt | null> {
    const updatedDto: Prisma.FoodUpdateInput = {
      ...updateFoodDto,
      recipeSteps: undefined,
    };

    const updated = await this.updateFoodMainFields(id, updatedDto);

    if (updated && updateFoodDto.recipeSteps) {
      await this.updateFoodIngredients(
        updated.id,
        updateFoodDto.recipeSteps.map((e) => ({
          recipe: e.recipe,
          stepNumber: e.stepNumber,
          foodId: updated.id,
          ingredients: e.ingredients ?? [],
        })),
      );
    }

    return this.prisma.food.findFirst({
      where: {
        id: updated.id,
      },
      include: FoodExtInclude,
    });
  }

  async createFoodMainFields(data: Prisma.FoodCreateInput): Promise<Food> {
    try {
      return await this.prisma.food.create({
        data: {
          ...data,
        },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async updateFoodMainFields(id: number, data: Prisma.FoodUpdateInput): Promise<Food> {
    try {
      return this.prisma.food.update({
        data: {
          ...data,
        },
        where: {
          id: id,
        },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async updateFoodIngredients(
    id: number,
    data: (Prisma.RecipeStepCreateManyInput & { ingredients: IngregientDto[] })[],
  ) {
    try {
      await this.prisma.ingredient.deleteMany({
        where: {
          recipeStep: {
            foodId: id,
          },
        },
      });

      await this.prisma.recipeStep.deleteMany({
        where: {
          foodId: id,
        },
      });

      data.forEach(async (element) => {
        const created = await this.prisma.recipeStep.create({
          data: { ...element, ingredients: undefined },
        });

        await this.prisma.ingredient.createMany({
          data: element.ingredients.map((e) => ({
            ...e,
            recipeStepId: created.id,
            id: undefined,
          })),
        });
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async deleteFood(where: Prisma.FoodWhereUniqueInput): Promise<boolean> {
    await this.prisma.food.update({
      where,
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    return true;
  }
}
