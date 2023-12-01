import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IncomeOutcomeTypesService } from './incomeOutcomeTypes.service';
import { RequestExt } from '../auth/entities/request-ext.entity';
import { CreateIncomeOutcomeTypeDto } from './dto/create-outcome-type.dto';

@ApiTags('Пользователи')
@Controller('incomeOutcomeTypes')
// @UseGuards(AuthGuard)

// @ApiOperation({
//   summary: 'Получение должности',
//   description: 'РОЛИ - ACCESS_TO_BOT',
// })
// @ApiResponse({ status: 200, type: Object })
export class IncomeOutcomeTypesController {
  constructor(private readonly incomeOutcomeTypesService: IncomeOutcomeTypesService) { }

  //@UseGuards(AuthGuard)
  @Get('outcome')
  async getOutcomeTypes(@Req() req: RequestExt) {
    const productsByType = await this.incomeOutcomeTypesService.getOutcomeTypes(/*req.user.id*/ 1);
    return { data: productsByType };
  }

  //@UseGuards(AuthGuard)
  @Get('income')
  async getIncomeTypes(@Req() req: RequestExt) {
    const productsByType = await this.incomeOutcomeTypesService.getIncomeTypes(/*req.user.id*/ 1);
    return { data: productsByType };
  }

  //@UseGuards(AuthGuard)
  @Post('outcome')
  async createOutcomeType(@Req() req: RequestExt, @Body() createIncomeOutcomeTypeDto: CreateIncomeOutcomeTypeDto) {
    return {
      data: await this.incomeOutcomeTypesService.createOutcomeType(/*req.user.id*/ 1, createIncomeOutcomeTypeDto),
    };
  }
  //@UseGuards(AuthGuard)
  @Post('income')
  async createIncomeType(@Req() req: RequestExt, @Body() createIncomeOutcomeTypeDto: CreateIncomeOutcomeTypeDto) {
    return {
      data: await this.incomeOutcomeTypesService.createIncomeType(/*req.user.id*/ 1, createIncomeOutcomeTypeDto),
    };
  }
}
