import { Controller, Delete, Patch, Post } from '@nestjs/common';

@Controller('/account')
export class AccountController {
  constructor() {}

  @Post()
  signupLocal() {}

  @Post()
  signupByGoogle() {}

  @Patch()
  updateEmail() {}

  @Patch()
  updatePassword() {}

  @Delete()
  deleteAccount() {}
}
