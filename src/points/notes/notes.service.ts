import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import 'multer';
import { PutDayNoteDto } from './dto/put-day-note.dto';
import { DayNote } from '@prisma/client';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) { }

  async dayNote(userId, date: string): Promise<DayNote> {
    try {
      const data = await this.prisma.dayNote.findFirst({
        where: {
          date,
          userId,
        },
      });
      return (
        data ?? {
          date: date,
          note: '',
          userId: userId,
        }
      );
    } catch {
      throw new BadRequestException();
    }
  }

  async putDayNote(userId, date: string, putDayNoteDto: PutDayNoteDto): Promise<DayNote> {
    try {
      return await this.prisma.dayNote.upsert({
        create: {
          date,
          userId,
          note: putDayNoteDto.note,
        },
        update: {
          note: putDayNoteDto.note,
        },
        where: {
          userId_date: {
            date,
            userId,
          },
        },
      });
    } catch {
      throw new BadRequestException();
    }
  }
}
