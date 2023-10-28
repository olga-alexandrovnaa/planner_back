import { Body, Controller, Get, NotFoundException, Param, Post, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { GetDayTasksDto } from './dto/get-day-tasks.dto';
import { GetUserTrackersDto } from './dto/get-user-trackers.dto';
import { SetTaskCheckDto } from './dto/set-task-check.dto';
import { DeleteTaskInDateDto } from './dto/delete-task-in-date.dto';
import { ResheduleTaskDto } from './dto/reshedule-task.dto';
import { TaskProgressDto } from './dto/task-progress.dto';

@ApiTags('Пользователи')
@Controller('api/tasks')
@UseGuards(AuthGuard)

// @ApiOperation({
//   summary: 'Получение должности',
//   description: 'РОЛИ - ACCESS_TO_BOT',
// })
// @ApiResponse({ status: 200, type: Object })
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  //создать
  @Post()
  async createTaskById(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.createTask(createTaskDto);
  }
  //ред задачу, изменить даты повтора
  @Patch()
  async updateTaskById(@Body() updateTaskDto: UpdateTaskDto) {
    return await this.tasksService.updateTask(updateTaskDto);
  }

  //удалить трекер
  @Delete()
  async deleteTaskById(@Body() deleteTaskDto: DeleteTaskDto) {
    return await this.tasksService.deleteTask(deleteTaskDto);
  }

  //получение трекера с инф о повторах
  @Get(':id')
  async getTaskById(@Param('id') id: number) {
    const task = await this.tasksService.taskExt({ id });
    if (!task) throw new NotFoundException();
    return task;
  }

  //получение трекеров по дню, типу
  @Get('dayTasks')
  async getDayTasks(@Body() getDayTasksDto: GetDayTasksDto) {
    const tasks = await this.tasksService.dayTasks(getDayTasksDto);
    return tasks;
  }

  //получение (кол-во, кол-во выполненных) по конкретному трекеру за период
  @Get(':id/progress')
  async taskProgress(@Param('id') id: number, @Body() taskProgressDto: TaskProgressDto) {
    return await this.taskProgress(id, taskProgressDto);
  }

  //получение списка всех трекеров пользователя
  @Get('userTasks')
  async getUserTasks(@Body() getUserTrackersDto: GetUserTrackersDto) {
    const tasks = await this.tasksService.userTrackers(getUserTrackersDto.userId);
    return tasks;
  }
  //отметить трекер
  @Get(':id/setTaskCheck')
  async getSetTaskCheck(@Param('id') id: number, @Body() setTaskCheckDto: SetTaskCheckDto) {
    return await this.getSetTaskCheck(id, setTaskCheckDto);
  }
  //удалить трекер в дне
  @Get(':id/deleteTaskInDate')
  async deleteTaskInDate(@Param('id') id: number, @Body() deleteTaskInDateDto: DeleteTaskInDateDto) {
    return await this.deleteTaskInDate(id, deleteTaskInDateDto);
  }
  //перенести трекер в дне
  @Get(':id/resheduleTask')
  async resheduleTask(@Param('id') id: number, @Body() resheduleTaskDto: ResheduleTaskDto) {
    return await this.resheduleTask(id, resheduleTaskDto);
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
