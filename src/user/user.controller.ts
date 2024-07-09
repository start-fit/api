import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('user')
export class UserController {

  @Get('/')
  async login(@Req() req: Request) {
    console.log(req.user);

    return {
      status: 200
    };
  }
}
