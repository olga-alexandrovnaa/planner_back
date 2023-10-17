import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from './token.service';
import * as moment from 'moment';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new UnauthorizedException();

      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) throw new UnauthorizedException();

      const user = this.tokenService.validateAccessToken(token);
      if (!user) throw new UnauthorizedException();

      req.user = user;
      console.log(
        `\x1b[2m${req.id}\x1b[0m`,
        `${moment(new Date()).format('yyyy-MM-DD HH:mm:ss.SSS')}`,
        `Authorized: \x1b[1;36m${req.user.userName})\x1b[0m`,
      );

      return true;
    } catch (err) {
      const req = context.switchToHttp().getRequest();
      if (err instanceof UnauthorizedException) {
        console.log(
          `\x1b[2m${req.id}\x1b[0m`,
          `${moment(new Date()).format('yyyy-MM-DD HH:mm:ss.SSS')}`,
          'Unauthorized',
        );
        throw err;
      }
      throw new InternalServerErrorException();
    }
  }
}
