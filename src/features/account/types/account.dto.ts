import { Prisma } from '@prisma/client';
import { ProfileDTO } from '../../profile';

export interface AccountDTO {
  id: string;
  email: string;
  profile: ProfileDTO;
}

export const fullAccountQueryArg = Prisma.validator<Prisma.UserArgs>()({
  include: {
    profile: {
      include: {
        avatar: true,
      },
    },
  },
});

export type AccountModel = Prisma.UserGetPayload<typeof fullAccountQueryArg>;
