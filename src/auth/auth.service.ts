import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const payload = { email: user.email, sub: user.id };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
