import { Body, Controller, Get, UseGuards, Query, Req, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { NotesService } from './notes.service';
import { RequestExt } from '../auth/entities/request-ext.entity';
import { PutDayNoteDto } from './dto/put-day-note.dto';

@ApiTags('Пользователи')
@Controller('notes')
// @UseGuards(AuthGuard)

// @ApiOperation({
//   summary: 'Получение должности',
//   description: 'РОЛИ - ACCESS_TO_BOT',
// })
// @ApiResponse({ status: 200, type: Object })
export class NotesController {
  constructor(private readonly notesService: NotesService) { }
  //@UseGuards(AuthGuard)
  @Get('dayNote')
  async getDayNote(@Req() req: RequestExt, @Query('date') date: string) {
    const notes = await this.notesService.dayNote(/*req.user.id*/ 1, date);
    return { data: notes };
  }

  //@UseGuards(AuthGuard)
  @Put('dayNote')
  async updateDayNoteById(@Req() req: RequestExt, @Query('date') date: string, @Body() putDayNoteDto: PutDayNoteDto) {
    return { data: await this.notesService.putDayNote(/*req.user.id*/ 1, date, putDayNoteDto) };
  }
}
