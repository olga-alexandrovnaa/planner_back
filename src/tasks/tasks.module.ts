import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
@Module({
  controllers: [TasksController],
  providers: [PrismaService, TasksService],
  imports: [forwardRef(() => AuthModule)],
  exports: [TasksService],
})
export class TasksModule {}
