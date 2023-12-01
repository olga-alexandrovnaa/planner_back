import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IncomeType, OutcomeType } from '@prisma/client';
import 'multer';
import { CreateIncomeOutcomeTypeDto } from './dto/create-outcome-type.dto';

@Injectable()
export class IncomeOutcomeTypesService {
  constructor(private readonly prisma: PrismaService) { }

  async createOutcomeType(userId, createIncomeOutcomeTypeDto: CreateIncomeOutcomeTypeDto): Promise<OutcomeType> {
    try {
      return await this.prisma.outcomeType.create({
        data: { ...createIncomeOutcomeTypeDto, userId },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async createIncomeType(userId, createIncomeOutcomeTypeDto: CreateIncomeOutcomeTypeDto): Promise<IncomeType> {
    try {
      return await this.prisma.incomeType.create({
        data: { ...createIncomeOutcomeTypeDto, userId },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async getOutcomeTypes(userId): Promise<OutcomeType[]> {
    try {
      return await this.prisma.outcomeType.findMany({ where: { userId } });
    } catch {
      throw new BadRequestException();
    }
  }

  async getIncomeTypes(userId): Promise<IncomeType[]> {
    try {
      return await this.prisma.incomeType.findMany({ where: { userId } });
    } catch {
      throw new BadRequestException();
    }
  }
}
