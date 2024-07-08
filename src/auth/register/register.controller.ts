import { Body, Controller, Post, Request } from '@nestjs/common';

@Controller('/')
export class RegisterController {
  @Post('/')
  async login(@Request() req, @Body() body) {
    console.log(body);

    return req.user;
  }
}
