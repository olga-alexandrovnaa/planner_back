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
import { TaskShort } from './entities/task-short.entity';
import { tasksType } from './entities/task-type.entity';
import {
  addDays,
  addMonths,
  addYears,
  differenceInCalendarDays,
  endOfMonth,
  getDay,
  getISOWeeksInYear,
  getWeek,
  getWeeksInMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { ListTask } from './entities/list-task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) { }

  async task(taskWhereUniqueInput: Prisma.TaskWhereUniqueInput): Promise<Task | null> {
    try {
      return this.prisma.task.findUnique({ where: taskWhereUniqueInput });
    } catch {
      throw new BadRequestException();
    }
  }

  async tasksExt(where: Prisma.TaskWhereInput): Promise<TaskExt[]> {
    let checkWhere: Prisma.RepeatDayTaskCheckWhereInput = {
      date: '',
    };

    if (where.date) {
      checkWhere = {
        OR: [
          {
            date: String(where.date),
            newDate: null,
          },
          {
            newDate: String(where.date),
          },
        ],
      };
    }

    try {
      const data = await this.prisma.task.findMany({
        where: where,
        include: {
          ...TaskExtInclude,
          taskRepeatDayCheck: {
            where: checkWhere,
          },
        },
      });
      return data;
    } catch {
      throw new BadRequestException();
    }
  }

  async taskExt(id: number, date: string): Promise<TaskExt | null> {
    try {
      const data = await this.prisma.task.findUnique({
        where: { id: id },
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
      return data;
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

    if (repeatCount && addDays(start, intervalLength * repeatCount) <= main) {
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
    if (repeatCount && addDays(addDays(startOfWeek(start), 7), 7 * intervalLength * repeatCount) <= main) {
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

    return s.map((e) => e.dayFromBeginningInterval).includes(weekDayWithMondayStart + 1);
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

    const shedule = repeatDays.filter(
      (e) => e.intervalPartIndex !== null && (e.dayFromBeginningInterval !== null || e.weekNumber !== null),
    );

    if (main < start || !shedule.length) {
      return false;
    }

    //если последней день последнего месяца < main
    if (repeatCount && addMonths(startOfMonth(start), intervalLength * repeatCount) <= main) {
      return false;
    }

    const mainStart = startOfMonth(main);
    const mainEnd = endOfMonth(main);

    const createStart = startOfMonth(start);
    let yearDif = mainStart.getFullYear() - createStart.getFullYear();
    let monthDif = mainStart.getMonth() - createStart.getMonth();
    if (monthDif < 0) {
      monthDif = 12 + monthDif;
      yearDif = yearDif - 1;
    }
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

      if (main.getDate() === 28 && main.getMonth() === 1 && main.getFullYear() % 4 !== 0) {
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
    if (weekDayOfMonthStartWithMondayStart >= weekDayWithMondayStart) {
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
    if (dif >= 3) {
      if (weekDayWithMondayStart >= weekDayOfMonthEndWithMondayStart) {
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
    if (repeatCount && addYears(startOfYear(start), repeatCount * intervalLength) <= main) {
      return false;
    }

    //количество лет прошедших с начала до даты % длина интервала + 1
    const index = ((main.getFullYear() - start.getFullYear()) % intervalLength) + 1;
    const s = shedule.filter((e) => e.intervalPartIndex === index);
    if (!s.length) return false;

    const res = !!s.find((e) => e.yearDateDay === main.getDate() && e.yearDateMonth === main.getMonth());

    if (res) return true;

    if (main.getDate() === 28 && main.getMonth() === 1 && main.getFullYear() % 4 !== 0) {
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
        result = await this.tasksExt({
          userId: userId,
          isTracker: false,
          isDeleted: false,
          date: date,
          ...where,
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
            // if (tracker.date === date) {
            //   result.push(tracker);
            // }
            break;
        }
      });

      return result.map((e) => ({
        id: e.id,
        name: e.name,
        checked: e.taskRepeatDayCheck?.length ? e.taskRepeatDayCheck[0].checked : false,
        deadline: e.taskRepeatDayCheck?.length ? e.taskRepeatDayCheck[0].deadline : null,
        intervalLength: e.intervalLength,
        intervalPart: e.intervalPart,
        isFood: e.isFood,
        isTracker: e.isTracker,
        moneyIncome:
          e.taskRepeatDayCheck?.length && e.taskRepeatDayCheck[0].moneyIncomeFact
            ? e.taskRepeatDayCheck[0].moneyIncomeFact
            : e.moneyIncomePlan,
        moneyOutcome:
          e.taskRepeatDayCheck?.length && e.taskRepeatDayCheck[0].moneyOutcomeFact
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

  async dayTrackerMoneyInfo(date: string): Promise<{
    income: number;
    outcome: number;
  }> {
    try {
      const result: TaskExt[] = [];

      const trackers = await this.userTrackersExt(date, undefined);

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
        let income = 0;
        let outcome = 0;
        for (const iterator of result) {
          if (!!iterator.taskRepeatDayCheck.length && iterator.taskRepeatDayCheck[0].moneyIncomeFact) {
            income += iterator.taskRepeatDayCheck[0].moneyIncomeFact;
          } else if (iterator.moneyIncomePlan) {
            income += iterator.moneyIncomePlan;
          }

          if (!!iterator.taskRepeatDayCheck.length && iterator.taskRepeatDayCheck[0].moneyOutcomeFact) {
            outcome += iterator.taskRepeatDayCheck[0].moneyOutcomeFact;
          } else if (iterator.moneyOutcomePlan) {
            outcome += iterator.moneyOutcomePlan;
          }
        }
        return {
          income,
          outcome,
        };
      }
      return {
        income: 0,
        outcome: 0,
      };
    } catch {
      throw new BadRequestException();
    }
  }
  async dayTask(trackerId: number, date: string): Promise<TaskExt | null> {
    try {
      const result: TaskExt[] = [];

      const task = await this.taskExt(trackerId, date);

      if (!task) return null;

      if (!task.isTracker) {
        return task;
      }

      const where: Prisma.TaskWhereInput = {
        id: trackerId,
      };

      const trackers = await this.userTrackersExt(date, undefined, where);

      //расчет какие сегодня должны отобразиться
      trackers.forEach((tracker) => {
        // if (
        //   tracker.date === date &&
        //   (!tracker.taskRepeatDayCheck ||
        //     (tracker.taskRepeatDayCheck.length && !tracker.taskRepeatDayCheck[0].isDeleted))
        // ) {
        //   result.push(tracker);
        //   return;
        // }

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

  async createTask(userId: number, createTaskDto: CreateTaskDto): Promise<TaskExt | null> {
    try {
      const createdDto: Prisma.TaskCreateInput = {
        ...createTaskDto,
        user: { connect: { id: userId } },
        ingredients: undefined,
        repeatDays: undefined,
        repeatIfYearIntervalDays: undefined,
        taskRepeatDayCheck: undefined,
      };

      const created = await this.createTaskMainFields(createdDto);

      const promiseArr: Promise<any>[] = [];

      if (created && createTaskDto.ingredients?.length) {
        promiseArr.push(
          this.updateTaskIngredients(
            created.id,
            createTaskDto.ingredients.map((e) => ({ ...e, trackerId: created.id, id: undefined })),
          ),
        );
      }

      if (created && createTaskDto.repeatDays?.length) {
        promiseArr.push(
          this.updateTaskRepeatDays(
            created.id,
            createTaskDto.repeatDays.map((e) => ({ ...e, trackerId: created.id, id: undefined })),
          ),
        );
      }

      if (created && createTaskDto.repeatIfYearIntervalDays?.length) {
        promiseArr.push(
          this.updateTaskRepeatYearDays(
            created.id,
            createTaskDto.repeatIfYearIntervalDays.map((e) => ({ ...e, trackerId: created.id, id: undefined })),
          ),
        );
      }

      if (created && createTaskDto.taskRepeatDayCheck?.length) {
        promiseArr.push(
          this.updateTaskRepeatDayCheck(created.id, {
            ...createTaskDto.taskRepeatDayCheck[0],
            trackerId: created.id,
            id: undefined,
          }),
        );
      }

      return Promise.all(promiseArr).then(async () => {
        return await this.taskExt(created.id, created.date);
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<TaskExt | null> {
    try {
      const promiseArr: Promise<any>[] = [];

      if (updateTaskDto.ingredients?.length) {
        promiseArr.push(
          this.updateTaskIngredients(
            id,
            updateTaskDto.ingredients.map((e) => ({ ...e, id: undefined })),
          ),
        );
      }

      if (updateTaskDto.repeatDays?.length) {
        promiseArr.push(
          this.updateTaskRepeatDays(
            id,
            updateTaskDto.repeatDays.map((e) => ({ ...e, id: undefined })),
          ),
        );
      }

      if (updateTaskDto.repeatIfYearIntervalDays?.length) {
        promiseArr.push(
          this.updateTaskRepeatYearDays(
            id,
            updateTaskDto.repeatIfYearIntervalDays.map((e) => ({ ...e, id: undefined })),
          ),
        );
      }

      if (updateTaskDto.taskRepeatDayCheck?.length) {
        promiseArr.push(this.updateTaskRepeatDayCheck(id, { ...updateTaskDto.taskRepeatDayCheck[0], id: undefined }));
      }

      return Promise.all(promiseArr).then(async () => {
        const updatedDto: Prisma.TaskUpdateInput = {
          ...updateTaskDto,
          ingredients: undefined,
          repeatDays: undefined,
          repeatIfYearIntervalDays: undefined,
          taskRepeatDayCheck: undefined,
        };

        const updated = await this.updateTaskMainFields(id, updatedDto);
        return await this.taskExt(updated.id, updated.date);
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async createTaskMainFields(data: Prisma.TaskCreateInput): Promise<Task> {
    try {
      return await this.prisma.task.create({
        data: {
          ...data,
        },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async updateTaskMainFields(id: number, data: Prisma.TaskUpdateInput): Promise<Task> {
    try {
      return this.prisma.task.update({
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

  async updateTaskRepeatDays(id: number, data: Prisma.RepeatDayTaskWithNotYearIntervalCreateManyInput[]) {
    try {
      await this.prisma.repeatDayTaskWithNotYearInterval.deleteMany({
        where: {
          trackerId: id,
        },
      });

      await this.prisma.repeatDayTaskWithNotYearInterval.createMany({
        data: data,
      });
    } catch (err) {
      console.log(err);

      throw new BadRequestException();
    }
  }

  async updateTaskRepeatYearDays(id: number, data: Prisma.RepeatDayTaskWithYearIntervalCreateManyInput[]) {
    try {
      await this.prisma.repeatDayTaskWithYearInterval.deleteMany({
        where: {
          trackerId: id,
        },
      });

      await this.prisma.repeatDayTaskWithYearInterval.createMany({
        data: data,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async updateTaskIngredients(id: number, data: Prisma.IngredientCreateManyInput[]) {
    try {
      await this.prisma.ingredient.deleteMany({
        where: {
          trackerId: id,
        },
      });

      await this.prisma.ingredient.createMany({
        data: data,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async updateTaskRepeatDayCheck(id: number, data: Prisma.RepeatDayTaskCheckCreateManyInput) {
    try {
      await this.prisma.repeatDayTaskCheck.deleteMany({
        where: {
          trackerId: id,
          date: data.date,
        },
      });

      await this.prisma.repeatDayTaskCheck.createMany({
        data: data,
      });
    } catch {
      throw new BadRequestException();
    }
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

  isoString(date: Date = new Date()): string {
    const tzo = date.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';
    const pad = function (num: number) {
      return (num < 10 ? '0' : '') + num;
    };

    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes()) +
      ':' +
      pad(date.getSeconds())
      // +
      // dif +
      // pad(Math.floor(Math.abs(tzo) / 60)) +
      // ':' +
      // pad(Math.abs(tzo) % 60)
    );
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
        date: this.isoString(start),
        ...(await this.dayTrackerPlanAndCheckInfo(id, this.isoString(start))),
      });
      start = addDays(start, 1);
    }
    return res;
  }

  async editMonthMoneyInfo(userId: number, date: string, remainder: number, investment: number) {
    await this.prisma.monthMoneyInfo.upsert({
      create: {
        date,
        investment,
        remainder,
        userId,
      },
      update: {
        date,
        investment,
        remainder,
        userId,
      },
      where: {
        date: date,
      },
    });
    return true;
  }

  async monthWalletInfo(
    dateStart: string,
    dateEnd: string,
    userId: number,
  ): Promise<{
    startRemainder: number;
    investSum: number;
    endRemainder: number;
    days: {
      date: string;
      income: number;
      outcome: number;
      remainder: number;
    }[];
  }> {
    let start = startOfDay(new Date(dateStart));
    const end = startOfDay(new Date(dateEnd));
    let remainder = 0;
    let investment = 0;

    const monthMoneyInfo = await this.prisma.monthMoneyInfo.findFirst({
      where: {
        userId: userId,
        date: this.isoString(start),
      },
    });

    if (monthMoneyInfo) {
      remainder = monthMoneyInfo.remainder;
      investment = monthMoneyInfo.investment;
    }

    let endRemainder = remainder;

    const res: {
      startRemainder: number;
      investSum: number;
      endRemainder: number;
      days: {
        date: string;
        income: number;
        outcome: number;
        remainder: number;
      }[];
    } = {
      startRemainder: remainder,
      investSum: investment,
      endRemainder: 0,
      days: [],
    };

    while (start <= end) {
      const d = this.isoString(start);
      const info = await this.dayTrackerMoneyInfo(this.isoString(start));

      endRemainder += info.income;
      endRemainder -= info.outcome;

      res.days.push({
        date: d,
        income: info.income,
        outcome: info.outcome,
        remainder: endRemainder,
      });

      start = addDays(start, 1);
    }

    endRemainder -= investment;

    res.endRemainder = endRemainder;

    return res;
  }

  async setTaskCheck(id: number, date: string): Promise<boolean> {
    try {
      const info = await this.dayTask(id, date);
      if (!info) throw new BadRequestException();

      const _date = !info.taskRepeatDayCheck.length ? date : info.taskRepeatDayCheck[0].date;

      await this.prisma.repeatDayTaskCheck.update({
        where: {
          trackerId_date: {
            trackerId: id,
            date: _date,
          },
        },
        data: {
          checked: true,
        }
      })

      return true;
    } catch {
      throw new BadRequestException();
    }

  }

  async removeTaskCheck(id: number, date: string): Promise<boolean> {
    try {
      const info = await this.dayTask(id, date);
      if (!info) throw new BadRequestException();

      const _date = !info.taskRepeatDayCheck.length ? date : info.taskRepeatDayCheck[0].date;

      await this.prisma.repeatDayTaskCheck.update({
        where: {
          trackerId_date: {
            trackerId: id,
            date: _date,
          },
        },
        data: {
          checked: false,
        }
      })

      return true;
    } catch {
      throw new BadRequestException();
    }
  }

  async deleteTaskInDate(id: number, date: string): Promise<boolean> {
    const info = await this.dayTask(id, date);
    if (!info) throw new BadRequestException();

    if (!info.isTracker) {
      await this.deleteTask({ id });
      return true;
    }

    const _date = !info.taskRepeatDayCheck.length ? date : info.taskRepeatDayCheck[0].date;

    await this.prisma.repeatDayTaskCheck.update({
      where: {
        trackerId_date: {
          trackerId: id,
          date: _date,
        },
      },
      data: {
        isDeleted: true,
      }
    })
    return true;
  }

  async resheduleTask(id: number, date: string, newDate: string): Promise<boolean> {
    const info = await this.dayTask(id, date);
    if (!info) throw new BadRequestException();

    const _date = !info.taskRepeatDayCheck.length ? date : info.taskRepeatDayCheck[0].date;

    await this.prisma.repeatDayTaskCheck.update({
      where: {
        trackerId_date: {
          trackerId: id,
          date: _date,
        },
      },
      data: {
        newDate: newDate,
      }
    })
    return true;
  }
}
