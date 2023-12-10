import { Request } from 'express';
import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserValidation } from '../../auth';

@Injectable()
export class AccountGuard implements CanActivate {
  constructor(private auth: UserValidation) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();

    const accessToken = req.accessToken;

    const = await this.auth.validate(accessToken)
  }
}
