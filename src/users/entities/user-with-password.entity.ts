import { Prisma } from '@prisma/client';

const userWithPassword = Prisma.validator<Prisma.UserArgs>()({
  include: { password: true },
});

export type UserWithPassword = Prisma.UserGetPayload<typeof userWithPassword>;
