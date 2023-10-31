import { Module, ValidationPipe } from '@nestjs/common';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { TasksModule } from './tasks/tasks.module';

@Module({
  controllers: [AppController],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }, AppService],
  imports: [AuthModule, TasksModule],
  exports: [AppService],
})
export class AppModule {}
