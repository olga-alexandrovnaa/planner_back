import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  MoveTypeIfDayNotExists,
  Prisma,
  RepeatDayTaskWithNotYearInterval,
  RepeatDayTaskWithYearInterval,
  Task,
  WeekNumber,
} from '@prisma/client';
import { TaskExt, TaskExtInclude } from './entities/task-ext.entity';
import 'multer';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskShort } from './entities/task-short.entity';
import { tasksType } from './entities/task-type.entity';
import {
  addDays,
  addMonths,
  addYears,
  differenceInCalendarDays,
  endOfMonth,
  endOfYear,
  getDay,
  getISOWeeksInYear,
  getWeek,
  getWeeksInMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { ListTask } from './entities/list-task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async task(taskWhereUniqueInput: Prisma.TaskWhereUniqueInput): Promise<Task | null> {
    try {
      return await this.prisma.task.findUnique({ where: taskWhereUniqueInput });
    } catch {
      throw new BadRequestException();
    }
  }

  async taskExt(taskWhereUniqueInput: Prisma.TaskWhereUniqueInput): Promise<TaskExt | null> {
    try {
      return await this.prisma.task.findUnique({
        where: taskWhereUniqueInput,
        include: TaskExtInclude,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async userTrackers(userId: number): Promise<TaskShort[]> {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          userId: userId,
          isTracker: true,
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
          isFood: true,
          moneyIncomePlan: true,
          moneyOutcomePlan: true,
          taskRepeatDayCheck: {
            select: {
              moneyIncomeFact: true,
              moneyOutcomeFact: true,
            },
          },
        },
      });

      const taskShort: TaskShort[] = tasks.map((e) => ({
        ...e,
        isMoney:
          !!e.moneyIncomePlan ||
          !!e.moneyOutcomePlan ||
          e.taskRepeatDayCheck.some((e) => !!e.moneyIncomeFact || !!e.moneyOutcomeFact),
      }));

      return taskShort;
    } catch {
      throw new BadRequestException();
    }
  }

  async userTrackersExt(date: string, userId?: number, where?: Prisma.TaskWhereInput): Promise<TaskExt[]> {
    //отправить трекер + его выполнение в этот день
    //если это трекер, не удален, или удален позже интересуещего дня
    //если не удален в конкретном дне
    try {
      return await this.prisma.task.findMany({
        where: {
          AND: [
            {
              userId: userId,
              isTracker: true,
            },
            {
              OR: [
                {
                  isDeleted: true,
                  deletedAt: {
                    gte: new Date(date),
                  },
                },
                {
                  isDeleted: false,
                },
              ],
            },

            {
              taskRepeatDayCheck: {
                none: {
                  OR: [
                    {
                      date: date,
                      newDate: null,
                      isDeleted: true,
                    },
                    {
                      newDate: date,
                      isDeleted: true,
                    },
                  ],
                },
              },
            },

            where ? where : {},
          ],
        },
        include: {
          ...TaskExtInclude,
          taskRepeatDayCheck: {
            where: {
              OR: [
                {
                  date: date,
                  newDate: null,
                },
                {
                  newDate: date,
                },
              ],
            },
          },
        },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  isDayIntervalTrackerShowedInDate(
    date: string,
    dateStart: string,
    intervalLength: number,
    repeatCount?: number,
  ): boolean {
    const main = new Date(date);
    const start = new Date(dateStart);

    if (main === start) {
      return true;
    }

    if (main < start) {
      return false;
    }

    if (repeatCount && addDays(start, intervalLength * repeatCount) < main) {
      return false;
    }

    const dif = differenceInCalendarDays(main, start);

    return dif % intervalLength === 0;
  }

  isWeekIntervalTrackerShowedInDate(
    date: string,
    dateStart: string,
    intervalLength: number,
    repeatDays: RepeatDayTaskWithNotYearInterval[],
    repeatCount?: number,
  ): boolean {
    const main = new Date(date);
    const start = new Date(dateStart);

    const shedule = repeatDays.filter((e) => e.intervalPartIndex !== null && e.dayFromBeginningInterval !== null);

    if (main < start || !shedule.length) {
      return false;
    }

    //если последнее воскресенье < main
    if (repeatCount && addDays(addDays(startOfWeek(start), 7), 7 * intervalLength * repeatCount) < main) {
      return false;
    }

    const mainStart = addDays(startOfWeek(main), 1);
    const createStart = addDays(startOfWeek(start), 1);
    //количество недель прошедших с начала до даты % длина интервала + 1
    const index = ((differenceInCalendarDays(mainStart, createStart) / 7) % intervalLength) + 1;
    const s = shedule.filter((e) => e.intervalPartIndex === index);
    if (!s.length) return false;

    const weekDay = getDay(main);
    const weekDayWithMondayStart = weekDay === 0 ? 6 : weekDay - 1;

    return s.map((e) => e.dayFromBeginningInterval).includes(weekDayWithMondayStart);
  }

  getYearWeekNumber = (date = new Date()) => {
    const n = getDay(date) === 0 ? getWeek(date) - 1 : getWeek(date);
    if (n === 0) {
      const lastYearWeeksCount = getISOWeeksInYear(new Date(date.getFullYear(), 0, 1));
      return lastYearWeeksCount;
    }
    return n;
  };

  isMonthIntervalTrackerShowedInDate(
    date: string,
    dateStart: string,
    intervalLength: number,
    repeatDays: RepeatDayTaskWithNotYearInterval[],
    repeatCount?: number,
  ): boolean {
    const main = new Date(date);
    const start = new Date(dateStart);

    const shedule = repeatDays.filter((e) => e.intervalPartIndex !== null && e.dayFromBeginningInterval !== null);

    if (main < start || !shedule.length) {
      return false;
    }

    //если последней день последнего месяца < main
    if (repeatCount && addMonths(endOfMonth(start), intervalLength * repeatCount) < main) {
      return false;
    }

    const mainStart = startOfMonth(main);
    const mainEnd = endOfMonth(main);

    const createStart = startOfMonth(start);
    const yearDif = mainStart.getFullYear() - createStart.getFullYear();
    const monthDif = mainStart.getMonth() - createStart.getMonth();
    //количество месяцев прошедших с начала до даты % длина интервала + 1
    const index = ((monthDif * (yearDif + 1)) % intervalLength) + 1;
    const s = shedule.filter((e) => e.intervalPartIndex === index);
    if (!s.length) return false;

    const monthDay = main.getDate();

    const sheduleWithDates = s.filter((e) => !!e.dayFromBeginningInterval);
    const sheduleWithWeekDays = s.filter((e) => !e.dayFromBeginningInterval);

    //если есть график с датой
    if (sheduleWithDates.length) {
      const arr = sheduleWithDates.map((e) => e.dayFromBeginningInterval);
      if (arr.includes(monthDay)) return true;

      if (main.getDate() === 28 && main.getMonth() === 1 && !(main.getFullYear() % 4)) {
        if (
          sheduleWithDates.find(
            (e) =>
              e.dayFromBeginningInterval &&
              [29, 30, 31].includes(e.dayFromBeginningInterval) &&
              e.moveTypeIfDayNotExists === MoveTypeIfDayNotExists.currentIntervalLastDay,
          )
        )
          return true;
      }
      if (main.getDate() === 29 && main.getMonth() === 1) {
        if (
          sheduleWithDates.find(
            (e) =>
              e.dayFromBeginningInterval &&
              [30, 31].includes(e.dayFromBeginningInterval) &&
              e.moveTypeIfDayNotExists === MoveTypeIfDayNotExists.currentIntervalLastDay,
          )
        )
          return true;
      }
      if (main.getDate() === 30 && addDays(main, 1).getMonth() !== main.getMonth()) {
        if (
          sheduleWithDates.find(
            (e) =>
              e.dayFromBeginningInterval &&
              e.dayFromBeginningInterval === 31 &&
              e.moveTypeIfDayNotExists === MoveTypeIfDayNotExists.currentIntervalLastDay,
          )
        )
          return true;
      }
    }

    const weekDay = getDay(main);
    const weekDayWithMondayStart = weekDay === 0 ? 6 : weekDay - 1;

    const sheduleWithWeekDay = sheduleWithWeekDays.filter((e) => e.weekDayNumber === weekDayWithMondayStart);
    if (!sheduleWithWeekDay.length) return false;

    //если есть графики с днем недели
    const weekDayOfMonthStart = getDay(mainStart);
    const weekDayOfMonthStartWithMondayStart = weekDayOfMonthStart === 0 ? 6 : weekDayOfMonthStart - 1;

    const weekDayOfMonthEnd = getDay(mainEnd);
    const weekDayOfMonthEndWithMondayStart = weekDayOfMonthEnd === 0 ? 6 : weekDayOfMonthEnd - 1;

    const weekOfMonthStart = this.getYearWeekNumber(mainStart);
    const weekOfMain = this.getYearWeekNumber(main);
    const weeksCount = getWeeksInMonth(main, { weekStartsOn: 1 });
    const dif = weekOfMain - weekOfMonthStart;

    let type: WeekNumber;
    if (weekDayOfMonthStartWithMondayStart > weekDay) {
      if (dif === 1) {
        //первая
        type = WeekNumber.first;
      } else if (dif === 2) {
        //вторая
        type = WeekNumber.second;
      } else if (dif === 3) {
        //третья
        type = WeekNumber.third;
      }
    } else {
      if (dif === 0) {
        //первая
        type = WeekNumber.first;
      } else if (dif === 1) {
        //вторая
        type = WeekNumber.second;
      } else if (dif === 2) {
        //третья
        type = WeekNumber.third;
      }
    }
    if (dif > 3) {
      if (weekDay > weekDayOfMonthEndWithMondayStart) {
        if (weeksCount - 2 === dif) {
          //последняя
          type = WeekNumber.last;
        }
      } else {
        if (weeksCount - 1 === dif) {
          //последняя
          type = WeekNumber.last;
        }
      }
    }

    //график с днем недели и типом недели
    const res = sheduleWithWeekDays.find((e) => e.weekNumber === type);

    return !!res;
  }

  isYearIntervalTrackerShowedInDate(
    date: string,
    dateStart: string,
    intervalLength: number,
    repeatDays: RepeatDayTaskWithYearInterval[],
    repeatCount?: number,
  ): boolean {
    const main = new Date(date);
    const start = new Date(dateStart);

    const shedule = repeatDays.filter(
      (e) => e.intervalPartIndex !== null && e.yearDateDay !== null && e.yearDateMonth !== null,
    );

    if (main < start || !shedule.length) {
      return false;
    }

    //если последняя дата последнего года < main
    if (repeatCount && addYears(endOfYear(start), repeatCount * intervalLength) < main) {
      return false;
    }

    //количество лет прошедших с начала до даты % длина интервала + 1
    const index = ((main.getFullYear() - start.getFullYear()) % intervalLength) + 1;
    const s = shedule.filter((e) => e.intervalPartIndex === index);
    if (!s.length) return false;

    const res = !!s.find((e) => e.yearDateDay === main.getDate() && e.yearDateMonth === main.getMonth());

    if (res) return true;

    if (main.getDate() === 28 && main.getMonth() === 1 && !(main.getFullYear() % 4)) {
      if (
        !!s.find(
          (e) =>
            e.moveTypeIfDayNotExists === MoveTypeIfDayNotExists.currentIntervalLastDay &&
            e.yearDateDay === 29 &&
            e.yearDateMonth === 1,
        )
      )
        return true;
    }
    if (main.getDate() === 1 && main.getMonth() === 2) {
      if (
        !!s.find(
          (e) =>
            e.moveTypeIfDayNotExists === MoveTypeIfDayNotExists.nextIntervalFirstDay &&
            e.yearDateDay === 29 &&
            e.yearDateMonth === 1,
        )
      )
        return true;
    }
    return false;
  }

  async dayTasks(userId: number, date: string, type: tasksType): Promise<ListTask[]> {
    try {
      let where: Prisma.TaskWhereInput | undefined;

      switch (type) {
        case tasksType.all:
          where = undefined;
          break;
        case tasksType.income:
          where = {
            OR: [
              {
                moneyIncomePlan: {
                  not: null,
                },
              },
              {
                taskRepeatDayCheck: {
                  some: {
                    OR: [
                      {
                        date: date,
                        newDate: null,
                        moneyIncomeFact: {
                          not: null,
                        },
                      },
                      {
                        newDate: date,
                        moneyIncomeFact: {
                          not: null,
                        },
                      },
                    ],
                  },
                },
              },
            ],
          };
          break;
        case tasksType.outcome:
          where = {
            OR: [
              {
                moneyOutcomePlan: {
                  not: null,
                },
              },
              {
                taskRepeatDayCheck: {
                  some: {
                    OR: [
                      {
                        date: date,
                        newDate: null,
                        moneyOutcomeFact: {
                          not: null,
                        },
                      },
                      {
                        newDate: date,
                        moneyOutcomeFact: {
                          not: null,
                        },
                      },
                    ],
                  },
                },
              },
            ],
          };
          break;
        case tasksType.food:
          where = {
            isFood: true,
          };
          break;
      }

      //получить не трекеры
      let result: TaskExt[] = [];

      if (type !== tasksType.trackers) {
        result = await this.prisma.task.findMany({
          where: {
            isTracker: false,
            date: date,
            ...where,
          },
          include: TaskExtInclude,
        });
      }
      //получить все трекеры
      let trackers: TaskExt[];

      if (type !== tasksType.notTrackers) {
        trackers = await this.userTrackersExt(date, userId, where);
      } else {
        return result.map((e) => ({
          id: e.id,
          name: e.name,
          checked: e.taskRepeatDayCheck.length ? e.taskRepeatDayCheck[0].checked : false,
          deadline: e.taskRepeatDayCheck.length ? e.taskRepeatDayCheck[0].deadline : null,
          intervalLength: e.intervalLength,
          intervalPart: e.intervalPart,
          isFood: e.isFood,
          isTracker: e.isTracker,
          moneyIncome:
            e.taskRepeatDayCheck.length && e.taskRepeatDayCheck[0].moneyIncomeFact
              ? e.taskRepeatDayCheck[0].moneyIncomeFact
              : e.moneyIncomePlan,
          moneyOutcome:
            e.taskRepeatDayCheck.length && e.taskRepeatDayCheck[0].moneyOutcomeFact
              ? e.taskRepeatDayCheck[0].moneyOutcomeFact
              : e.moneyOutcomePlan,
          repeatCount: e.repeatCount,
        }));
      }

      //расчет какие сегодня должны отобразиться
      trackers.forEach((tracker) => {
        switch (tracker.intervalPart) {
          case 'Day':
            if (
              this.isDayIntervalTrackerShowedInDate(
                date,
                tracker.date,
                tracker.intervalLength ?? 1,
                tracker.repeatCount ?? undefined,
              )
            ) {
              result.push(tracker);
            }
            break;
          case 'Week':
            if (
              this.isWeekIntervalTrackerShowedInDate(
                date,
                tracker.date,
                tracker.intervalLength ?? 1,
                tracker.repeatDays,
                tracker.repeatCount ?? undefined,
              )
            ) {
              result.push(tracker);
            }
            break;
          case 'Month':
            if (
              this.isMonthIntervalTrackerShowedInDate(
                date,
                tracker.date,
                tracker.intervalLength ?? 1,
                tracker.repeatDays,
                tracker.repeatCount ?? undefined,
              )
            ) {
              result.push(tracker);
            }
            break;
          case 'Year':
            if (
              this.isYearIntervalTrackerShowedInDate(
                date,
                tracker.date,
                tracker.intervalLength ?? 1,
                tracker.repeatIfYearIntervalDays,
                tracker.repeatCount ?? undefined,
              )
            ) {
              result.push(tracker);
            }
            break;
          default:
            break;
        }
      });

      return result.map((e) => ({
        id: e.id,
        name: e.name,
        checked: e.taskRepeatDayCheck.length ? e.taskRepeatDayCheck[0].checked : false,
        deadline: e.taskRepeatDayCheck.length ? e.taskRepeatDayCheck[0].deadline : null,
        intervalLength: e.intervalLength,
        intervalPart: e.intervalPart,
        isFood: e.isFood,
        isTracker: e.isTracker,
        moneyIncome:
          e.taskRepeatDayCheck.length && e.taskRepeatDayCheck[0].moneyIncomeFact
            ? e.taskRepeatDayCheck[0].moneyIncomeFact
            : e.moneyIncomePlan,
        moneyOutcome:
          e.taskRepeatDayCheck.length && e.taskRepeatDayCheck[0].moneyOutcomeFact
            ? e.taskRepeatDayCheck[0].moneyOutcomeFact
            : e.moneyOutcomePlan,
        repeatCount: e.repeatCount,
      }));
    } catch {
      throw new BadRequestException();
    }
  }

  async dayTrackerPlanAndCheckInfo(trackerId: number, date: string): Promise<{ planed: boolean; checked: boolean }> {
    try {
      const result: TaskExt[] = [];

      const where: Prisma.TaskWhereInput = {
        id: trackerId,
      };

      const trackers = await this.userTrackersExt(date, undefined, where);

      //расчет какие сегодня должны отобразиться
      trackers.forEach((tracker) => {
        switch (tracker.intervalPart) {
          case 'Day':
            if (
              this.isDayIntervalTrackerShowedInDate(
                date,
                tracker.date,
                tracker.intervalLength ?? 1,
                tracker.repeatCount ?? undefined,
              )
            ) {
              result.push(tracker);
            }
            break;
          case 'Week':
            if (
              this.isWeekIntervalTrackerShowedInDate(
                date,
                tracker.date,
                tracker.intervalLength ?? 1,
                tracker.repeatDays,
                tracker.repeatCount ?? undefined,
              )
            ) {
              result.push(tracker);
            }
            break;
          case 'Month':
            if (
              this.isMonthIntervalTrackerShowedInDate(
                date,
                tracker.date,
                tracker.intervalLength ?? 1,
                tracker.repeatDays,
                tracker.repeatCount ?? undefined,
              )
            ) {
              result.push(tracker);
            }
            break;
          case 'Year':
            if (
              this.isYearIntervalTrackerShowedInDate(
                date,
                tracker.date,
                tracker.intervalLength ?? 1,
                tracker.repeatIfYearIntervalDays,
                tracker.repeatCount ?? undefined,
              )
            ) {
              result.push(tracker);
            }
            break;
          default:
            break;
        }
      });

      if (result.length) {
        return {
          planed: true,
          checked: !!result[0].taskRepeatDayCheck.length && result[0].taskRepeatDayCheck[0].checked,
        };
      }
      return {
        planed: false,
        checked: false,
      };
    } catch {
      throw new BadRequestException();
    }
  }

  async dayTask(trackerId: number, date: string): Promise<TaskExt | null> {
    try {
      const result: TaskExt[] = [];

      const where: Prisma.TaskWhereInput = {
        id: trackerId,
      };

      const trackers = await this.userTrackersExt(date, undefined, where);

      //расчет какие сегодня должны отобразиться
      trackers.forEach((tracker) => {
        switch (tracker.intervalPart) {
          case 'Day':
            if (
              this.isDayIntervalTrackerShowedInDate(
                date,
                tracker.date,
                tracker.intervalLength ?? 1,
                tracker.repeatCount ?? undefined,
              )
            ) {
              result.push(tracker);
            }
            break;
          case 'Week':
            if (
              this.isWeekIntervalTrackerShowedInDate(
                date,
                tracker.date,
                tracker.intervalLength ?? 1,
                tracker.repeatDays,
                tracker.repeatCount ?? undefined,
              )
            ) {
              result.push(tracker);
            }
            break;
          case 'Month':
            if (
              this.isMonthIntervalTrackerShowedInDate(
                date,
                tracker.date,
                tracker.intervalLength ?? 1,
                tracker.repeatDays,
                tracker.repeatCount ?? undefined,
              )
            ) {
              result.push(tracker);
            }
            break;
          case 'Year':
            if (
              this.isYearIntervalTrackerShowedInDate(
                date,
                tracker.date,
                tracker.intervalLength ?? 1,
                tracker.repeatIfYearIntervalDays,
                tracker.repeatCount ?? undefined,
              )
            ) {
              result.push(tracker);
            }
            break;
          default:
            break;
        }
      });

      if (result.length) {
        return result[0];
      }
      return null;
    } catch {
      throw new BadRequestException();
    }
  }

  async createTask(data: Prisma.TaskCreateManyInput): Promise<TaskExt> {
    return this.prisma.task.create({ data, include: TaskExtInclude });
  }

  async updateTask(id: number, data: UpdateTaskDto, where?: Prisma.TaskWhereUniqueInput): Promise<TaskExt> {
    const updated = await this.prisma.task.update({
      where: {
        ...where,
        id: id,
      },
      data: {
        ...data,
        ingredients: data.ingredients
          ? {
              set: data.ingredients.map((e) => ({
                ...e,
                trackerId_productId: {
                  productId: e.productId,
                  trackerId: e.trackerId,
                },
              })),
            }
          : undefined,
        repeatDays: data.repeatDays ? { set: data.repeatDays } : undefined,
        repeatIfYearIntervalDays: data.repeatIfYearIntervalDays
          ? {
              set: data.repeatIfYearIntervalDays,
            }
          : undefined,
        taskRepeatDayCheck: data.taskRepeatDayCheck
          ? {
              connectOrCreate: {
                create: data.taskRepeatDayCheck,
                where: {
                  trackerId_date: {
                    date: data.taskRepeatDayCheck.date,
                    trackerId: data.taskRepeatDayCheck.trackerId,
                  },
                },
              },
            }
          : undefined,
      },
      include: TaskExtInclude,
    });

    return updated;
  }

  async deleteTask(where: Prisma.TaskWhereUniqueInput): Promise<boolean> {
    await this.prisma.task.update({
      where,
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    return true;
  }

  async taskProgress(
    id: number,
    dateStart: string,
    dateEnd: string,
  ): Promise<
    {
      date: string;
      planed: boolean;
      checked: boolean;
    }[]
  > {
    let start = startOfDay(new Date(dateStart));
    const end = startOfDay(new Date(dateEnd));

    const res: {
      date: string;
      planed: boolean;
      checked: boolean;
    }[] = [];

    while (start <= end) {
      res.push({
        date: start.toISOString(),
        ...(await this.dayTrackerPlanAndCheckInfo(id, start.toISOString())),
      });
      start = addDays(start, 1);
    }
    return res;
  }

  async setTaskCheck(id: number, date: string): Promise<boolean> {
    const info = await this.dayTask(id, date);
    if (!info) throw new BadRequestException();

    const _date = !info.taskRepeatDayCheck.length ? date : info.taskRepeatDayCheck[0].date;

    const updated = await this.updateTask(id, {
      taskRepeatDayCheck: {
        trackerId: id,
        date: _date,
        checked: true,
      },
    });

    return !!updated;
  }

  async removeTaskCheck(id: number, date: string): Promise<boolean> {
    const info = await this.dayTask(id, date);
    if (!info) throw new BadRequestException();

    const _date = !info.taskRepeatDayCheck.length ? date : info.taskRepeatDayCheck[0].date;

    const updated = await this.updateTask(id, {
      taskRepeatDayCheck: {
        trackerId: id,
        date: _date,
        checked: false,
      },
    });
    return !!updated;
  }

  async deleteTaskInDate(id: number, date: string): Promise<boolean> {
    const info = await this.dayTask(id, date);
    if (!info) throw new BadRequestException();

    const _date = !info.taskRepeatDayCheck.length ? date : info.taskRepeatDayCheck[0].date;

    const updated = await this.updateTask(id, {
      taskRepeatDayCheck: {
        trackerId: id,
        date: _date,
        isDeleted: true,
      },
    });
    return !!updated;
  }

  async resheduleTask(id: number, date: string, newDate: string): Promise<boolean> {
    const info = await this.dayTask(id, date);
    if (!info) throw new BadRequestException();

    const _date = !info.taskRepeatDayCheck.length ? date : info.taskRepeatDayCheck[0].date;

    const updated = await this.updateTask(id, {
      taskRepeatDayCheck: {
        trackerId: id,
        date: _date,
        newDate: newDate,
      },
    });
    return !!updated;
  }
}
