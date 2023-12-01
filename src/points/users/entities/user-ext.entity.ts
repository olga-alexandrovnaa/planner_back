import { Prisma } from '@prisma/client';

export const UserExtInclude /* : Prisma.UserSelect */ = {};

const extended = Prisma.validator<Prisma.UserArgs>()({
  include: UserExtInclude,
});

export type UserExt = Prisma.UserGetPayload<typeof extended>;
