import { Body, Controller, Get, Post, Req, UseGuards, Response, UnauthorizedException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as moment from 'moment';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login-user-dto';
import { RegisterUserDTO } from './dto/register-user-dto';
import { AuthResponse } from './entities/auth-response.entity';
import { RequestExt } from './entities/request-ext.entity';

@ApiTags('Авторизация')
@Controller('auth')
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
      },
      required: ['name', 'userName', 'password'],
    },
  })
  @Post('registration')
  async registration(@Body() registerUserDTO: RegisterUserDTO, @Response() res) {
    const registerInfo: AuthResponse = await this.authService.registration(registerUserDTO);

    res.cookie('refreshToken', registerInfo.refreshToken, {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });
    return res.send({ user: registerInfo.user, accessToken: registerInfo.accessToken });

    // return registerInfo;
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
  async login(@Body() loginUserDTO: LoginUserDTO, @Req() req: RequestExt, @Response() res) {
    const userData = await this.authService.login(loginUserDTO);

    console.log(
      `\x1b[2m${req.id}\x1b[0m`,
      `${moment().format('yyyy-MM-DD HH:mm:ss.SSS')}`,
      `Logged in: \x1b[1;36m${userData.user.userName}\x1b[0m`,
    );

    res.cookie('refreshToken', userData.refreshToken, {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });
    return res.send({ user: userData.user, accessToken: userData.accessToken });
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
  async refreshToken(@Req() req: RequestExt, @Response() res) {
    if (req.cookies && 'refreshToken' in req.cookies && req.cookies.refreshToken.length > 0) {
      const refreshToken = req.cookies.refreshToken;

      const userData = await this.authService.refresh(refreshToken);

      console.log(
        `\x1b[2m${req.id}\x1b[0m`,
        `${moment().format('yyyy-MM-DD HH:mm:ss.SSS')}`,
        `Refreshed: \x1b[1;36m${userData.user.userName}\x1b[0m`,
      );
      res.cookie('refreshToken', userData.refreshToken, {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
      });
      return res.send({ user: userData.user, accessToken: userData.accessToken });
    }

    return new UnauthorizedException('Неверный пароль');
  }
}
