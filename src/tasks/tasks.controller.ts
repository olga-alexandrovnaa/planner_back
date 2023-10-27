import { Body, Controller, Get, NotFoundException, Param, Post, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { GetDayTasksDto } from './dto/get-day-tasks.dto';

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

  //создать, ред задачу
  //изменить даты повтора
  @Post()
  async createTaskById(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.createTask(createTaskDto);
  }

  @Patch()
  async updateTaskById(@Body() updateTaskDto: UpdateTaskDto) {
    return await this.tasksService.updateTask(updateTaskDto);
  }

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
  @Get(':id')
  async getDayTasksDto(@Body() getDayTasksDto: GetDayTasksDto) {
    // const task = await this.tasksService.taskExt({ id });
    // if (!task) throw new NotFoundException();
    // return task;
  }

  //получение трекеров (кол-во, кол-во выполненных) по периоду, типу, конкретному трекеру
  //получение списка всех трекеров пользователя
  //отметить трекер
  //удалить трекер в дне
  //перенести трекер в дне
  //удалить трекер
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
