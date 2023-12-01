import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { EventType } from '@prisma/client';
import 'multer';
import { addDays, format, startOfDay } from 'date-fns';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { PutEventCheckingDto } from './dto/put-event-checking.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) { }

  async createEventType(userId, createEventTypeDto: CreateEventTypeDto): Promise<EventType> {
    try {
      return await this.prisma.eventType.create({
        data: { ...createEventTypeDto, userId },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async getEventTypes(userId): Promise<EventType[]> {
    try {
      return await this.prisma.eventType.findMany({ where: { userId } });
    } catch {
      throw new BadRequestException();
    }
  }

  async putEventCheckingInfo(
    userId,
    eventId,
    dateStart: string,
    dateEnd: string,
    putEventCheckingDto: PutEventCheckingDto,
  ) {
    try {
      const event = await this.prisma.eventType.findFirst({
        where: {
          id: eventId,
          userId: userId,
        },
      });

      if (!event) return;

      let start = startOfDay(new Date(dateStart));
      const end = startOfDay(new Date(dateEnd));

      while (start <= end) {
        await this.prisma.eventCheck.delete({
          where: {
            eventId_date: {
              eventId: eventId,
              date: format(start, 'yyyy-MM-dd'),
            },
          },
        });
        start = addDays(start, 1);
      }

      for (const iterator of putEventCheckingDto.dates) {
        await this.prisma.eventCheck.upsert({
          create: {
            event: {
              connect: { id: eventId },
            },
            date: iterator,
          },
          update: {
            event: {
              connect: { id: eventId },
            },
            date: iterator,
          },
          where: {
            eventId_date: {
              date: iterator,
              eventId: eventId,
            },
          },
        });
      }
    } catch {
      throw new BadRequestException();
    }
  }
}
