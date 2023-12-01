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
// @UseGuards(AuthGuard)

// @ApiOperation({
//   summary: 'Получение должности',
//   description: 'РОЛИ - ACCESS_TO_BOT',
// })
// @ApiResponse({ status: 200, type: Object })
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  //@UseGuards(AuthGuard)
  @Get('holidays')
  async getBuyings(@Req() req: RequestExt, @Query('dateStart') dateStart: string, @Query('dateEnd') dateEnd: string) {
    const holidays = await this.tasksService.getHolidays(/*req.user.id*/ 1, dateStart, dateEnd);
    return { data: holidays };
  }

  //создать
  //@UseGuards(AuthGuard)
  @Post()
  async createTaskById(@Req() req: RequestExt, @Body() createTaskDto: CreateTaskDto) {
    return { data: await this.tasksService.createTask(/*req.user.id*/ 1, createTaskDto) };
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
      const tasks = await this.tasksService.dayTasks(/*req.user.id*/ 1, date, tasksType[type]);
      return { data: tasks };
    }
    return { data: [] };
  }

  //получение списка всех трекеров пользователя
  //@UseGuards(AuthGuard)
  @Get('userTrackers')
  async getUserTrackers(@Req() req: RequestExt) {
    const tasks = await this.tasksService.userTrackers(/*req.user.id*/ 1);
    return { data: tasks };
  }

  //остатки по месяцу (расх, дох, баланс по дням, остаток общ, инвест)
  @Get('month_wallet_info')
  async monthWalletInfo(
    @Req() req: RequestExt,
    @Query('dateStart') dateStart: string,
    @Query('dateEnd') dateEnd: string,
  ) {
    return {
      data: await this.tasksService.monthWalletInfo(dateStart, dateEnd, /*req.user.id*/ 1),
    };
  }

  //ред ост, инв месяца
  @Post('month_wallet_info')
  async editMonthMoneyInfo(
    @Req() req: RequestExt,
    @Query('date') date: string,
    @Query('remainder') remainder: number,
    @Query('investment') investment: number,
  ) {
    return await this.tasksService.editMonthMoneyInfo(/*req.user.id*/ 1, date, remainder, investment);
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
            date: date,
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

  //инвест по типам по месяцу (созд ред уд)
  //все типы инвест
  //создать, ред, уд. инвестиц тип
  //получ, созд, ред, уд праздники
}
