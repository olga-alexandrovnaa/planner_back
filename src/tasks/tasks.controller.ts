import { Body, Controller, Get, NotFoundException, Param, Post, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { tasksType } from './entities/task-type.entity';

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
  @Patch(':id')
  async updateTaskById(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return await this.tasksService.updateTask(id, updateTaskDto);
  }

  //удалить трекер
  @Delete(':id')
  async deleteTaskById(@Param('id') id: number) {
    return await this.tasksService.deleteTask({ id });
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
  async getDayTasks(@Query('userId') userId: number, @Query('date') date: string, @Query('type') type: tasksType) {
    const tasks = await this.tasksService.dayTasks(userId, date, type);
    return tasks;
  }

  //получение (кол-во, кол-во выполненных) по конкретному трекеру за период
  @Get(':id/progress')
  async taskProgress(
    @Param('id') id: number,
    @Query('dateStart') dateStart: string,
    @Query('dateEnd') dateEnd: string,
  ) {
    return await this.tasksService.taskProgress(id, dateStart, dateEnd);
  }

  //получение списка всех трекеров пользователя
  @Get('userTasks')
  async getUserTasks(@Query('userId') userId: number) {
    const tasks = await this.tasksService.userTrackers(userId);
    return tasks;
  }
  //отметить трекер
  @Patch(':id/setTaskCheck')
  async setTaskCheck(@Param('id') id: number, @Query('date') date: string) {
    return await this.tasksService.setTaskCheck(id, date);
  }
  //отметить трекер
  @Patch(':id/removeTaskCheck')
  async removeTaskCheck(@Param('id') id: number, @Query('date') date: string) {
    return await this.tasksService.removeTaskCheck(id, date);
  }
  //удалить трекер в дне
  @Delete(':id/deleteTaskInDate')
  async deleteTaskInDate(@Param('id') id: number, @Query('date') date: string) {
    return await this.tasksService.deleteTaskInDate(id, date);
  }
  //перенести трекер в дне
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
