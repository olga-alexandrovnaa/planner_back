import { Request } from 'express';
import { UserExt } from '../../users/entities/user-ext.entity';

export type RequestExt = Request & {
  id: string;
  user: UserExt;
};
