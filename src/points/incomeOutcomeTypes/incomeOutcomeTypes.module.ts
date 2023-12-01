import { forwardRef, Module } from '@nestjs/common';
import { IncomeOutcomeTypesService } from './incomeOutcomeTypes.service';
import { IncomeOutcomeTypesController } from './incomeOutcomeTypes.controller';
import { PrismaService } from '../../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [IncomeOutcomeTypesController],
  providers: [PrismaService, IncomeOutcomeTypesService],
  imports: [forwardRef(() => AuthModule)],
  exports: [IncomeOutcomeTypesService],
})
export class IncomeOutcomeTypesModule { }
