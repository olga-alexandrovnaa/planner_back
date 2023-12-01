import { BadRequestException, Injectable } from '@nestjs/common';
import { Buying, Prisma } from '@prisma/client';
import 'multer';
import { CreateBuyingDto } from './dto/create-buying.dto';
import { UpdateBuyingDto } from './dto/update-buying.dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class BuyingsService {
  constructor(private readonly prisma: PrismaService) { }
  async getBuyings(userId): Promise<Buying[]> {
    try {
      return await this.prisma.buying.findMany({
        where: {
          userId,
          checked: false,
        },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async getBuying(id): Promise<Buying | null> {
    try {
      return await this.prisma.buying.findFirst({
        where: { id },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async createBuying(userId, createBuyingDto: CreateBuyingDto): Promise<Buying> {
    try {
      return await this.prisma.buying.create({
        data: { ...createBuyingDto, userId },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async updateBuying(id, updateBuyingDto: UpdateBuyingDto): Promise<Buying> {
    try {
      return await this.prisma.buying.update({
        where: { id },
        data: updateBuyingDto,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async deleteBuying(where: Prisma.BuyingWhereUniqueInput): Promise<boolean> {
    await this.prisma.buying.delete({
      where,
    });
    return true;
  }
}
