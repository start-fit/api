import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/lib/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) { }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });
    return {
      access_token: this.jwtService.sign({
        username: user.email,
        sub: user.id,
      }),
    };
  }
}
