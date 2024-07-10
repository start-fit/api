import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'prisma/lib/prisma.service';

@Controller('user')
export class UserController {
  constructor(readonly prisma: PrismaService) { }
  @Get('/')
  async updateUser(@Req() req: Request) {

    // this.prisma.users.update({
    //   data: {
    //     name: req.body.name
    //   },
    //   where: {
    //     id: req.user.id
    //   }
    // });
    return {
      status: 200
    };
  }
}
