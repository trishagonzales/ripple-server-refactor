import { Controller, Get, Post } from '@nestjs/common';

@Controller('/auth')
export class AuthController {
  @Post()
  loginLocal() {}

  @Post('/google')
  loginByGoogle() {}

  @Post()
  logout() {}

  @Get('/access-token')
  resendAccessToken() {}
}
