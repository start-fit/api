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
        senha: true,
        id: true,
        email: true
      },
      where: { email },
    });

    if (await bcrypt.compare(password + email, user.senha)) {
      delete user.senha;
      return {
        date: new Date(),
        user,
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
