import { UserExt } from '../../users/entities/user-ext.entity';

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserExt;
};
