import { forwardRef, Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [EventsController],
  providers: [PrismaService, EventsService],
  imports: [forwardRef(() => AuthModule)],
  exports: [EventsService],
})
export class EventsModule { }
