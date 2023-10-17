import { Module, ValidationPipe } from '@nestjs/common';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }, AppService],
  imports: [AuthModule],
  exports: [AppService],
})
export class AppModule {}
