import { Body, Controller, Get, Param, Post, Patch, Delete, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BuyingsService } from './buyings.service';
import { RequestExt } from '../auth/entities/request-ext.entity';
import { UpdateBuyingDto } from './dto/update-buying.dto';
import { CreateBuyingDto } from './dto/create-buying.dto';

@ApiTags('Покупки')
@Controller('buyings')
// @UseGuards(AuthGuard)

// @ApiOperation({
//   summary: 'Получение должности',
//   description: 'РОЛИ - ACCESS_TO_BOT',
// })
// @ApiResponse({ status: 200, type: Object })
export class BuyingsController {
  constructor(private readonly buyingsService: BuyingsService) { }

  //@UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Все покупки пользователя',
  })
  @Get()
  async getBuyings(@Req() req: RequestExt) {
    const productsByType = await this.buyingsService.getBuyings(/*req.user.id*/ 1);
    return { data: productsByType };
  }
  //@UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Создать покупку',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        note: { type: 'string' },
      },
      required: ['note'],
    },
  })
  @Post()
  async createBuying(@Req() req: RequestExt, @Body() createBuyingDto: CreateBuyingDto) {
    return { data: await this.buyingsService.createBuying(/*req.user.id*/ 1, createBuyingDto) };
  }
  //@UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Удалить покупку',
  })
  @Delete(':id')
  async deleteBuying(@Req() req: RequestExt, @Param('id') id: number) {
    const buying = await this.buyingsService.getBuying(id);
    if (!buying || buying.userId !== /*req.user.id*/ 1) return;
    return { data: await this.buyingsService.deleteBuying({ id: id }) };
  }

  //@UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Все покупки пользователя',
  })
  @Patch(':id')
  async updateBuyingById(@Req() req: RequestExt, @Param('id') id: number, @Body() updateBuyingDto: UpdateBuyingDto) {
    const buying = await this.buyingsService.getBuying(id);
    if (!buying || buying.userId !== /*req.user.id*/ 1) return;
    return { data: await this.buyingsService.updateBuying(id, updateBuyingDto) };
  }
}
