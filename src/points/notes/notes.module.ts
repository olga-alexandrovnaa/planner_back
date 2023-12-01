import { forwardRef, Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { PrismaService } from '../../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [NotesController],
  providers: [PrismaService, NotesService],
  imports: [forwardRef(() => AuthModule)],
  exports: [NotesService],
})
export class NotesModule { }
