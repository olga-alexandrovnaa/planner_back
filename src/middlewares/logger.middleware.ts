import { Request, Response, NextFunction } from 'express';
import * as moment from 'moment';

const greenFont = '\x1b[32m';
const redFont = '\x1b[31m';
const yellowFont = '\x1b[33m';

const greenBG = '\x1b[1;37;42m';
const redBG = '\x1b[1;37;41m';
const yellowBG = '\x1b[1;37;43m';

const effects = {
  GET: { method: greenBG, address: greenFont },
  PATCH: { method: yellowBG, address: yellowFont },
  PUT: { method: yellowBG, address: yellowFont },
  POST: { method: yellowBG, address: yellowFont },
  DELETE: { method: redBG, address: redFont },
};

export function logger(req: Request & { id: string }, res: Response, next: NextFunction) {
  const ip = req.headers['x-real_ip'] || req.socket.remoteAddress;
  console.log(
    `\x1b[2m${req.id}\x1b[0m`,
    `${moment(new Date()).format('yyyy-MM-DD HH:mm:ss.SSS')}`,
    `\x1b[33m${ip}\x1b[0m`,
    // req.user ? `\x1b[1;34m${req.user.userName}\x1b[0m` : '',
    `\t${effects[req.method].method}${req.method}\x1b[0m`,
    `${effects[req.method].address}${req.originalUrl}\x1b[0m`,
    req.body && Object.entries(req.body).length ? `\t\x1b[1;30;47mBODY\x1b[0m ${JSON.stringify(req.body)}` : '',
  );

  next();
}
