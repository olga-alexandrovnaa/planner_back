import { Module, ValidationPipe } from '@nestjs/common';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AuthModule } from './points/auth/auth.module';
import { TasksModule } from './points/tasks/tasks.module';
import { ProductsModule } from './points/products/products.module';
import { BuyingsModule } from './points/buyings/buyings.module';
import { EventsModule } from './points/events/events.module';
import { IncomeOutcomeTypesModule } from './points/incomeOutcomeTypes/incomeOutcomeTypes.module';
import { NotesModule } from './points/notes/notes.module';

@Module({
  controllers: [AppController],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }, AppService],
  imports: [
    AuthModule,
    BuyingsModule,
    EventsModule,
    IncomeOutcomeTypesModule,
    NotesModule,
    TasksModule,
    ProductsModule,
  ],
  exports: [AppService],
})
export class AppModule { }
