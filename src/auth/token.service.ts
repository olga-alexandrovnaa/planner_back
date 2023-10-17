import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { TokenData } from './dto/token-data.dto';
import { UserExtToTokenMapper } from './mappers/userExt-token.mapper';
// import { TokenData } from './entities/token-data.entity';

@Injectable()
export class TokenService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  generateTokens(payload: { user: TokenData }) {
    const accessToken = this.jwt.sign(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: process.env.JWT_ACCESS_EXPIRES_IN });
    const refreshToken = this.jwt.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token: string): TokenData | null {
    try {
      const plainData = this.jwt.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
      const userData: TokenData = UserExtToTokenMapper.parse(plainData.user);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string): TokenData | null {
    try {
      const plainData = this.jwt.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
      const userData: TokenData = plainData.user;
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId: number, refreshToken: string): Promise<Token | null> {
    return this.prisma.token.upsert({
      where: { userId },
      update: { refreshToken },
      create: { userId, refreshToken },
    });
  }

  async removeToken(userId: number) {
    return this.prisma.token.delete({ where: { userId } });
  }

  async findToken(refreshToken: string) {
    return this.prisma.token.findFirst({ where: { refreshToken } });
  }
}
