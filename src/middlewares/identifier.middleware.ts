import { Request, Response, NextFunction } from 'express';
import * as moment from 'moment';

export function identifier(req: Request, res: Response, next: NextFunction) {
  Object.assign(req, { id: Number(moment().format('x')).toString(36) });

  next();
}
