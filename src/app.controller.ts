import { Controller, Next, Patch, Post, Put, Req } from '@nestjs/common';
import * as moment from 'moment';
import { AppService } from './app.service';
import { RequestExt } from './auth/entities/request-ext.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logBody(@Req() req: RequestExt, @Next() next: () => unknown) {
    if (req.body)
      console.log(
        `\x1b[2m${req.id}\x1b[0m`,
        `${moment().format('yyyy-MM-DD HH:mm:ss.SSS')}`,
        `\x1b[1;30;47mBODY\x1b[0m \x1b[37m${JSON.stringify(req.body)}\x1b[0m`,
      );
    return next();
  }

  @Post('*')
  postHello(@Req() req: RequestExt, @Next() next: () => unknown) {
    return this.logBody(req, next);
  }

  @Put('*')
  putHello(@Req() req: RequestExt, @Next() next: () => unknown) {
    return this.logBody(req, next);
  }

  @Patch('*')
  patchHello(@Req() req: RequestExt, @Next() next: () => unknown) {
    return this.logBody(req, next);
  }
}
