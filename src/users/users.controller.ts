import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';
import { RequestExt } from '../auth/entities/request-ext.entity';

@ApiTags('Пользователи')
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Получение информации о себе',
    description: 'РОЛИ - FULL_ACCESS, ACCESS_TO_BOT',
  })
  @ApiResponse({ status: 200, type: Object })
  @Get('getMe')
  async getMe(@Req() req: RequestExt) {
    const id = req.user.id;
    const user = await this.usersService.user({ id });
    return user;
  }

}


// @Put(':id/setPermissions') //Patch,Delete,Post
// async setPermissionsById(@Param('id') id: number, @Body() dto: SetPermissionsDto) {