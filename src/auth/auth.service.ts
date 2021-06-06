import { Injectable, NotFoundException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { mongooseId } from '../user/helper/mongoose.service';
import { config } from '../config/app.config';
import { ErrorConstants } from '../constants/error.constant';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
  ) {}

  async validateUser(token, req): Promise<any> {
    token = token.replace(`"`, '');
    token = token.replace(`"`, '');
    const query = { _id: mongooseId(token) };
    const result = await this.usersService.findOne(query);
    if (!result) throw new NotFoundException(ErrorConstants.NO_USER_FOUND);
    return result;
  }
  
  async jwtSign(id) {
    return jwt.sign(JSON.stringify(id),config.jwt_secret);
  }
}
