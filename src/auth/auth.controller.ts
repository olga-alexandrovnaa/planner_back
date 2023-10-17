import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as moment from 'moment';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login-user-dto';
import { RefreshTokenDTO } from './dto/refresh-token-dto';
import { RegisterUserDTO } from './dto/register-user-dto';
import { AuthResponse } from './entities/auth-response.entity';
import { RequestExt } from './entities/request-ext.entity';

@ApiTags('Авторизация')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Регистрация',
  })
  @ApiResponse({ status: 200 | 401 | 400, type: Object })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        userName: { type: 'string' },
        password: { type: 'string' },
        passwordConfirm: { type: 'string' },
      },
      required: ['name', 'userName', 'password', 'passwordConfirm'],
    },
  })
  @Post('registration')
  async registration(@Body() registerUserDTO: RegisterUserDTO) {
    const registerInfo: AuthResponse = await this.authService.registration(registerUserDTO);
    return registerInfo;
  }

  @ApiOperation({
    summary: 'Авторизация',
  })
  @ApiResponse({ status: 200 | 401 | 400, type: Object })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userName: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['userName', 'password'],
    },
  })
  @Post('login')
  async login(@Body() loginUserDTO: LoginUserDTO, @Req() req: RequestExt) {
    const userData = await this.authService.login(loginUserDTO);

    console.log(
      `\x1b[2m${req.id}\x1b[0m`,
      `${moment().format('yyyy-MM-DD HH:mm:ss.SSS')}`,
      `Logged in: \x1b[1;36m${userData.user.userName}\x1b[0m`,
    );
    return userData;
  }

  @ApiOperation({ summary: 'Выход' })
  @ApiResponse({ status: 200, type: Object })
  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@Req() req: RequestExt) {
    await this.authService.logout(req.user.id);
    return true;
  }

  @ApiOperation({ summary: 'Обновление refreshToken' })
  @ApiResponse({ status: 200 | 401, type: Object })
  @Post('refresh')
  async refreshToken(@Body() refreshTokenDTO: RefreshTokenDTO, @Req() req: RequestExt) {
    const { refreshToken } = refreshTokenDTO;
    const userData = await this.authService.refresh(refreshToken);

    console.log(
      `\x1b[2m${req.id}\x1b[0m`,
      `${moment().format('yyyy-MM-DD HH:mm:ss.SSS')}`,
      `Refreshed: \x1b[1;36m${userData.user.userName}\x1b[0m`,
    );
    return userData;
  }
}
