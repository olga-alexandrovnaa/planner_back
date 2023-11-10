import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { tasksType } from './entities/task-type.entity';
import { RequestExt } from '../auth/entities/request-ext.entity';

@ApiTags('Пользователи')
@Controller('tasks')
@UseGuards(AuthGuard)

// @ApiOperation({
//   summary: 'Получение должности',
//   description: 'РОЛИ - ACCESS_TO_BOT',
// })
// @ApiResponse({ status: 200, type: Object })
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  //создать
  //@UseGuards(AuthGuard)
  @Post()
  async createTaskById(@Req() req: RequestExt, @Body() createTaskDto: CreateTaskDto) {
    return { data: await this.tasksService.createTask(req.user.id, createTaskDto) };
  }
  //ред задачу, изменить даты повтора
  //@UseGuards(AuthGuard)
  @Patch(':id')
  async updateTaskById(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return { data: await this.tasksService.updateTask(id, updateTaskDto) };
  }

  //удалить трекер
  //@UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTaskById(@Param('id') id: number) {
    return await this.tasksService.deleteTask({ id });
  }

  //получение трекеров по дню, типу
  //@UseGuards(AuthGuard)
  @Get('dayTasks')
  async getDayTasks(@Req() req: RequestExt, @Query('date') date: string, @Query('type') type: string) {
    if (type in tasksType) {
      const tasks = await this.tasksService.dayTasks(req.user.id, date, tasksType[type]);
      return tasks;
    }
    return [];
  }

  //получение трекера с инф о повторах и выполнению в день
  //@UseGuards(AuthGuard)
  @Get(':id')
  async getTaskById(@Param('id') id: number, @Query('date') date: string) {
    let task = await this.tasksService.taskExt(id, date);
    if (task && !task.taskRepeatDayCheck.length) {
      task = {
        ...task,
        taskRepeatDayCheck: [
          {
            id: 0,
            checked: false,
            date: task.date,
            deadline: null,
            isDeleted: false,
            moneyIncomeFact: null,
            moneyOutcomeFact: null,
            newDate: null,
            note: '',
            trackerId: task.id,
          },
        ],
      };
    }
    if (!task) throw new NotFoundException();
    return { data: task };
  }

  //получение (кол-во, кол-во выполненных) по конкретному трекеру за период
  //@UseGuards(AuthGuard)
  @Get(':id/progress')
  async taskProgress(
    @Param('id') id: number,
    @Query('dateStart') dateStart: string,
    @Query('dateEnd') dateEnd: string,
  ) {
    return {
      data: await this.tasksService.taskProgress(id, dateStart, dateEnd),
    };
  }

  //получение списка всех трекеров пользователя
  //@UseGuards(AuthGuard)
  @Get('userTrackers')
  async getUserTrackers(@Req() req: RequestExt) {
    const tasks = await this.tasksService.userTrackers(req.user.id);
    return { data: tasks };
  }
  //отметить трекер
  //@UseGuards(AuthGuard)
  @Patch(':id/setTaskCheck')
  async setTaskCheck(@Param('id') id: number, @Query('date') date: string) {
    return await this.tasksService.setTaskCheck(id, date);
  }
  //отметить трекер
  //@UseGuards(AuthGuard)
  @Patch(':id/removeTaskCheck')
  async removeTaskCheck(@Param('id') id: number, @Query('date') date: string) {
    return await this.tasksService.removeTaskCheck(id, date);
  }
  //удалить трекер в дне
  //@UseGuards(AuthGuard)
  @Delete(':id/deleteTaskInDate')
  async deleteTaskInDate(@Param('id') id: number, @Query('date') date: string) {
    return await this.tasksService.deleteTaskInDate(id, date);
  }
  //перенести трекер в дне
  //@UseGuards(AuthGuard)
  @Patch(':id/resheduleTask')
  async resheduleTask(@Param('id') id: number, @Query('dateStart') date: string, @Query('dateEnd') newDate: string) {
    return await this.tasksService.resheduleTask(id, date, newDate);
  }

  //остатки по месяцу (расх, дох, баланс по дням, остаток общ, инвест)
  //ред ост месяца
  //ред инв месяца
  //инвест по типам по месяцу (созд ред уд)
  //все типы инвест
  //создать, ред, уд. инвестиц тип
  //продукты с уже добавленными ингрид за период
  //получ, создать, ред, уд типы продуктов, продукты
  //получ, созд, ред, отметка покупки
  //получ, созд, ред, уд заметки по дню
  //получ, созд, ред, уд заметки
  //получ, созд, ред, уд праздники
}

// @Put(':id/setPermissions') //Patch,Delete,Post
// async setPermissionsById(@Param('id') id: number, @Body() dto: SetPermissionsDto) {
