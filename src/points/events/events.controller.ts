import { Body, Controller, Get, Param, Post, Query, Req, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { EventsService } from './events.service';
import { RequestExt } from '../auth/entities/request-ext.entity';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { PutEventCheckingDto } from './dto/put-event-checking.dto';

@ApiTags('События')
@Controller('events')
// @UseGuards(AuthGuard)

// @ApiOperation({
//   summary: 'Получение должности',
//   description: 'РОЛИ - ACCESS_TO_BOT',
// })
// @ApiResponse({ status: 200, type: Object })
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  //@UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Все типы событий',
  })
  @Get()
  async getEventTypes(@Req() req: RequestExt) {
    const productsByType = await this.eventsService.getEventTypes(/*req.user.id*/ 1);
    return { data: productsByType };
  }

  //@UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Создать тип события',
  })
  @Post()
  async createEventType(@Req() req: RequestExt, @Body() createEventTypeDto: CreateEventTypeDto) {
    return { data: await this.eventsService.createEventType(/*req.user.id*/ 1, createEventTypeDto) };
  }

  //@UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Установить дни ',
  })
  @Put(':id/сheckingInfo')
  async eventTypeCheckingInfo(
    @Req() req: RequestExt,
    @Param('id') id: number,
    @Query('dateStart') dateStart: string,
    @Query('dateEnd') dateEnd: string,
    @Body() putEventCheckingDto: PutEventCheckingDto,
  ) {
    return {
      data: await this.eventsService.putEventCheckingInfo(
        /*req.user.id*/ 1,
        id,
        dateStart,
        dateEnd,
        putEventCheckingDto,
      ),
    };
  }

  //@UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Удалить тип события',
  })
  @Delete()
  async deleteEvent(@Req() req: RequestExt, @Param('id') id: number) {
    const event = await this.eventsService.getEventType(id);
    if (event?.userId !== /*req.user.id*/ 1) {
      return;
    }

    return {
      data: await this.eventsService.deleteEventType(id),
    };
  }
}
