import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as moment from 'moment';
import { Response } from 'express';
import { RequestExt } from '../points/auth/entities/request-ext.entity';

@Injectable()
export class LogRequestsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<RequestExt>();

    const strings: string[] = [];

    if (req.query) strings.push(`\x1b[1;30;47mQUERY\x1b[0m \x1b[37m${JSON.stringify(req.query)}\x1b[0m`);
    if (req.params) strings.push(`\x1b[1;30;47mPARAMS\x1b[0m \x1b[37m${JSON.stringify(req.params)}\x1b[0m`);

    // Body - in AppController '*'
    // if (req.body) strings.push(`\x1b[1;30;47mBODY\x1b[0m \x1b[37m${JSON.stringify(req.body)}\x1b[0m`);

    strings.every((s) => console.log(`\x1b[2m${req.id}\x1b[0m`, `${moment().format('yyyy-MM-DD HH:mm:ss.SSS')}`, s));

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse<Response>();
        console.log(
          `\x1b[2m${req.id}\x1b[0m`,
          `${moment().format('yyyy-MM-DD HH:mm:ss.SSS')}`,
          `Response: ${res.statusCode}`,
          // data ? `DATA: ${JSON.stringify(data)}` : '',
        );
      }),
    );
  }
}
