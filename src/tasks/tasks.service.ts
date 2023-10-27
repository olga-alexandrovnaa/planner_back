import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Task } from '@prisma/client';
import { TaskExt, TaskExtInclude } from './entities/task-ext.entity';
import 'multer';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetDayTasksDto, tasksType } from './dto/get-day-tasks.dto';

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

  async tasks(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TaskWhereUniqueInput;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
  }): Promise<Task[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.task.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async dayTasks(data: GetDayTasksDto): Promise<Task[]> {
    try {
      const { date, type } = data;
      let where: Prisma.TaskWhereInput | undefined;

      //получить не трекеры
      //получить все трекеры
      //расчет какие сегодня должны отобразиться
      //отправить для этих трекеров объект check

      switch (type) {
        case tasksType.all:
          where = undefined;
          break;
        case tasksType.income:
          break;
        case tasksType.outcome:
          break;
        case tasksType.food:
          break;
        case tasksType.trackers:
          break;
      }

      where = { ...where, date };

      return await this.prisma.task.findMany({
        where,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async createTask(data: Prisma.TaskCreateManyInput): Promise<TaskExt> {
    return this.prisma.task.create({ data, include: TaskExtInclude });
  }

  async updateTask(data: UpdateTaskDto): Promise<TaskExt> {
    const updated = await this.prisma.task.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        ingredients: data.ingredients ? { set: data.ingredients } : undefined,
        repeatDays: data.ingredients ? { set: data.repeatDays } : undefined,
        repeatIfYearIntervalDays: data.ingredients ? { set: data.repeatIfYearIntervalDays } : undefined,
        taskRepeatDayCheck: data.ingredients ? { set: data.taskRepeatDayCheck } : undefined,
      },
      include: TaskExtInclude,
    });

    return updated;
  }

  async deleteTask(where: Prisma.TaskWhereUniqueInput): Promise<boolean> {
    await this.prisma.task.delete({
      where,
    });
    return true;
  }
}
