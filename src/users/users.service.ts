import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Password, Prisma, User } from '@prisma/client';
import { UserWithPassword } from './entities/user-with-password.entity';
import { UserExt, UserExtInclude } from './entities/user-ext.entity';
import 'multer';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: userWhereUniqueInput });
    } catch {
      throw new BadRequestException();
    }
  }

  async userExt(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<UserExt | null> {
    try {
      return await this.prisma.user.findUnique({
        where: userWhereUniqueInput,
        include: UserExtInclude,
      });
    } catch {
      throw new BadRequestException();
    }
  }
  async userWithPassword(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<UserWithPassword | null> {
    try {
      return await this.prisma.user.findUnique({
        where: userWhereUniqueInput,
        include: { password: true },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async createUser(data: Prisma.UserCreateManyInput): Promise<UserExt> {
    return this.prisma.user.create({ data, include: UserExtInclude });
  }

  async setPassword(userId: number, password: string): Promise<Password> {
    const hash = await bcrypt.hash(password, Number(process.env.PASS_HASH_ROUNDS) || 5);

    return this.prisma.password.upsert({
      where: { userId },
      create: { hash, userId },
      update: { createdAt: new Date(), hash },
    });
  }

  async setUserName(userId: number, userName: string): Promise<User> {
    return this.prisma.user.update({ where: { id: userId }, data: { userName } });
  }

  async getPassword(userId: number): Promise<Password | null> {
    return this.prisma.password.findUnique({ where: { userId } });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
  }): Promise<UserExt> {
    const { where, data } = params;
    return this.prisma.user.update({
      where,
      data,
      include: UserExtInclude,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<boolean> {
    await this.prisma.user.updateMany({
      where,
      data: { deletedAt: new Date() },
    });
    return true;
  }
}
