import { Body, Controller, Get, NotFoundException, Param, Post, Patch, Delete, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { RequestExt } from '../auth/entities/request-ext.entity';
import { CreateFoodDto } from './dto/create-food.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FoodType } from '@prisma/client';

@ApiTags('Пользователи')
@Controller('products')
// @UseGuards(AuthGuard)

// @ApiOperation({
//   summary: 'Получение должности',
//   description: 'РОЛИ - ACCESS_TO_BOT',
// })
// @ApiResponse({ status: 200, type: Object })
export class ProductsController {
  constructor(private readonly tasksService: ProductsService) { }

  //@UseGuards(AuthGuard)
  @Get('allIngredients')
  async allIngredients(
    @Req() req: RequestExt,
    @Query('dateStart') dateStart: string,
    @Query('dateEnd') dateEnd: string,
  ) {
    const allIngredients = await this.tasksService.allIngredients(/*req.user.id*/ 1, dateStart, dateEnd);
    return { data: allIngredients };
  }

  //@UseGuards(AuthGuard)
  @Get('foodOptionsByType')
  async getFoodOptionsByType(@Req() req: RequestExt, @Query('type') type: FoodType, @Query('date') date: string) {
    const foodOptionsByType = await this.tasksService.foodOptionsByType(/*req.user.id*/ 1, type, date);
    return { data: foodOptionsByType };
  }

  //@UseGuards(AuthGuard)
  @Get('measureUnits')
  async getMeasureUnits() {
    const measureUnits = await this.tasksService.measureUnits();
    return { data: measureUnits };
  }

  //@UseGuards(AuthGuard)
  @Get('measureUnitsByIngredient/:product')
  async getMeasureUnitsByIngredient(@Req() req: RequestExt, @Param('product') product: number) {
    const measureUnits = await this.tasksService.measureUnitsByIngredient(product);
    return { data: measureUnits };
  }

  //@UseGuards(AuthGuard)
  @Get('productsByType/:type')
  async getProductsByType(@Req() req: RequestExt, @Param('type') type: number) {
    const productsByType = await this.tasksService.productsByType(/*req.user.id*/ 1, type);
    return { data: productsByType };
  }

  //@UseGuards(AuthGuard)
  @Get('productTypes')
  async getProductTypes() {
    const productTypes = await this.tasksService.productTypes();
    return { data: productTypes };
  }

  //@UseGuards(AuthGuard)
  @Post('product')
  async createProductById(@Req() req: RequestExt, @Body() createProductDto: CreateProductDto) {
    return { data: await this.tasksService.createProduct(/*req.user.id*/ 1, createProductDto) };
  }

  //@UseGuards(AuthGuard)
  @Post('food')
  async createFood(@Req() req: RequestExt, @Body() createFoodDto: CreateFoodDto) {
    return { data: await this.tasksService.createFood(/*req.user.id*/ 1, createFoodDto) };
  }

  //@UseGuards(AuthGuard)
  @Patch('food/:id')
  async updateFoodById(@Req() req: RequestExt, @Param('id') id: number, @Body() updateFoodDto: UpdateFoodDto) {
    const food = await this.tasksService.foodExt(id);
    if (!food || food.userId !== /*req.user.id*/ 1) return;
    return { data: await this.tasksService.updateFood(id, updateFoodDto) };
  }

  //@UseGuards(AuthGuard)
  @Delete('food/:id')
  async deleteFoodById(@Req() req: RequestExt, @Param('id') id: number) {
    const food = await this.tasksService.foodExt(id);
    if (!food || food.userId !== /*req.user.id*/ 1) return;
    return await this.tasksService.deleteFood({ id });
  }

  //@UseGuards(AuthGuard)
  @Get('food/:id')
  async getFoodById(@Param('id') id: number) {
    const food = await this.tasksService.foodExt(id);
    if (!food) throw new NotFoundException();
    return { data: food };
  }
}
