import { forwardRef, Module } from '@nestjs/common';
import { BuyingsService } from './buyings.service';
import { AuthModule } from '../auth/auth.module';
import { BuyingsController } from './buyings.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [BuyingsController],
  providers: [PrismaService, BuyingsService],
  imports: [forwardRef(() => AuthModule)],
  exports: [BuyingsService],
})
export class BuyingsModule { }
