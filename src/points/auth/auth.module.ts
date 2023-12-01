import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [AuthController],
  providers: [PrismaService, AuthService, TokenService],
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    forwardRef(() => UsersModule),
  ],
  exports: [AuthService, TokenService, JwtModule],
})
export class AuthModule { }
