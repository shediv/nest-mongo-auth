import {
  ExecutionContext,
  Injectable,
  Inject,
  forwardRef,
  HttpException
} from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/app.config';
import { AuthService } from './auth.service';
import { ErrorConstants } from '../constants/error.constant';

@Injectable()
export class JwtAuthGuard {
  constructor(private jwtService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      throw new HttpException(ErrorConstants.TOKEN_NOT_FOUND, 401);
    }
    req.user = await this.validateToken(req.headers.authorization, req);
    return true;
  }

  async validateToken(auth: string, req) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException(ErrorConstants.TOKEN_FORMAT_ERROR, 401);
    }
    const token = auth.split(' ')[1];
    try {
      const res = jwt.verify(token, config.jwt_secret);

      const result = await this.jwtService.validateUser(res, req);
      return result;
    } catch (err) {
      throw new HttpException(ErrorConstants.TOKEN_MISMATCH, 401);
    }
  }
}
