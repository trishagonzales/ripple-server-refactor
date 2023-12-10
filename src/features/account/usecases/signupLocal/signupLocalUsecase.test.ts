import { omit } from 'lodash';
import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { UserRepo } from '../../repos/User.repo';
import { SignupLocalUsecase } from './signupLocal.usecase';
import { SignupLocalInput } from './signupLocal.dto';
import { AccountRepo } from '../../repos/Account.repo';
import { AuthService } from 'features/shared/auth';
import { CacheService } from 'features/shared/cache';

describe('SignupLocalUsecase', () => {
  it('return account DTO', async () => {
    const accountModule = await Test.createTestingModule({
      providers: [SignupLocalUsecase, AccountRepo, UserRepo],
    }).compile();

    const sharedModule = await Test.createTestingModule({
      providers: [AuthService, CacheService],
    }).compile();

    const signupLocal = accountModule.get(SignupLocalUsecase);
    const accountRepo = accountModule.get(AccountRepo);
    const userRepo = accountModule.get(UserRepo);
    const authService = sharedModule.get(AuthService);

    const signupInput: SignupLocalInput = {
      email: faker.internet.email(),
      password: faker.internet.password(10),
    };
    const refreshToken = faker.random.alphaNumeric(10);
    const accessToken = faker.random.alphaNumeric(10);

    jest
      .spyOn(userRepo, 'isExistByEmail')
      .mockImplementation(async () => false);
    jest.spyOn(accountRepo, 'save').mockImplementation(jest.fn());
    jest
      .spyOn(authService, 'login')
      .mockImplementation(async () => ({ refreshToken, accessToken }));

    const output = await signupLocal.exec(signupInput);

    expect(output.isSuccess).toBe(true);
    expect(output.value.account).toMatchObject(omit(signupInput, ['password']));
    expect(output.value.tokens).toBeDefined();
  });
});
