import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
  HttpException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as moment from 'moment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const req = context.switchToHttp().getRequest();
        console.log(`\x1b[2m${req.id}\x1b[0m`, `${moment().format('yyyy-MM-DD HH:mm:ss.SSS')}`, `Error: ${err.name}`);

        if (err.code === 'P2002') return throwError(() => new ConflictException('Запись существует'));
        if (err.code === 'P2003') return throwError(() => new ConflictException('Существуют связанные объекты'));
        if (err.code === 'P2025') return throwError(() => new NotFoundException());
        if (err instanceof HttpException) return throwError(() => err);
        console.error(`Error code: \x1b[1;31m${err.code || 'Error code is not exists'}\x1b[0m`, err.message);
        return throwError(() => new InternalServerErrorException());
      }),
    );
  }
}
