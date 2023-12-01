import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { TasksService } from '../tasks/tasks.service';

@Module({
  controllers: [ProductsController],
  providers: [PrismaService, TasksService, ProductsService],
  imports: [forwardRef(() => AuthModule)],
  exports: [ProductsService],
})
export class ProductsModule { }
