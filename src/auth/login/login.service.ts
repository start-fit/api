import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/lib/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) { }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.prisma.users.findUnique({
      select: {
        password: true,
        id: true,
        email: true
      },
      where: { email },
    });

    if (await bcrypt.compare(password + email, user.password)) {
      return {
        date: new Date(),
        access_token: this.jwtService.sign({
          email: user.email,
          sub: user.id,
        }, {
          secret: process.env.SECRETE_KEY,
        }),
      };
    }
    throw new UnauthorizedException();
  }
}
