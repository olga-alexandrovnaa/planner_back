import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUserDTO } from './dto/register-user-dto';
import { LoginUserDTO } from './dto/login-user-dto';
import { UsersService } from '../users/users.service';
import { TokenService } from './token.service';
import { UserExtToTokenMapper } from './mappers/userExt-token.mapper';
import { UserExt } from '../users/entities/user-ext.entity';
import { AuthResponse } from './entities/auth-response.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  async registration(registerUserDto: RegisterUserDTO): Promise<AuthResponse> {
    const { userName, password, name } = registerUserDto;
    if (!userName || !password || !name) {
      throw new BadRequestException('Недостаточно данных');
    }

    const candidates = await this.usersService.users({ where: { userName } });
    if (candidates.length) throw new BadRequestException(`Пользователь "${userName}" уже зарегистрирован`);

    const user = await this.usersService.createUser({
      userName,
      name,
    });
    const userExt = await this.usersService.userExt({ id: user.id });
    if (!userExt) throw new UnauthorizedException();
    const tokenData = UserExtToTokenMapper.map(userExt);

    const passwordResult = await this.usersService.setPassword(user.id, password);
    if (!passwordResult) throw new Error('Ошибка сохранения пароля в базу');

    const tokens = this.tokenService.generateTokens({ user: tokenData });
    this.tokenService.saveToken(user.id, tokens.refreshToken);

    return { user, ...tokens };
  }

  async login(loginUserDTO: LoginUserDTO): Promise<AuthResponse> {
    const user = await this.validateUser(loginUserDTO);
    const tokenData = UserExtToTokenMapper.map(user);
    const tokens = this.tokenService.generateTokens({ user: tokenData });
    await this.tokenService.saveToken(user.id, tokens.refreshToken);
    return { user, ...tokens };
  }

  async logout(userId: number) {
    const token = await this.tokenService.removeToken(userId);
    return token;
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const tokenData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);
    if (!tokenData || !tokenFromDb) throw new UnauthorizedException();

    const user = await this.usersService.userExt({ id: tokenData.id });
    if (!user) throw new NotFoundException();

    const newTokenData = UserExtToTokenMapper.map(user);
    const tokens = this.tokenService.generateTokens({ user: newTokenData });
    await this.tokenService.saveToken(user.id, tokens.refreshToken);
    return { user, ...tokens };
  }

  private async validateUser(userDto: LoginUserDTO): Promise<UserExt> {
    const { userName, password } = userDto;

    const users = await this.usersService.users({ where: { userName } }).catch((err) => {
      console.error(err.stack);
      return [];
    });
    if (!users.length) throw new NotFoundException(`Пользователь ${userName} не найден`);

    const pass = await this.usersService.getPassword(users[0].id);
    if (!pass) throw new UnauthorizedException();
    const passwordEquals = bcrypt.compareSync(password, pass.hash);
    if (!passwordEquals) throw new UnauthorizedException('Неверный пароль');

    return users[0];
  }
}
