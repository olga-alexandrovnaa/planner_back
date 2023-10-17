import { BadRequestException } from '@nestjs/common';
import { UserExt } from '../../users/entities/user-ext.entity';
import { TokenData } from '../entities/token-data.entity';

export class UserExtToTokenMapper {
  static map: (user: UserExt) => TokenData;
  static parse: (data: TokenData) => TokenData;
}

UserExtToTokenMapper.map = (user) => {
  if (!user.userName) throw new BadRequestException();
  return {
    id: user.id,
    userName: user.userName,
    name: user.firstName,
  };
};

UserExtToTokenMapper.parse = (data) => ({
  id: Number(data.id),
  userName: data.userName,
  name: data.name,
});
