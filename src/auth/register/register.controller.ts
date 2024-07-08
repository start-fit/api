import { Body, Controller, Post, Request } from '@nestjs/common';
import { RegisterService } from './register.service';

@Controller('/')
export class RegisterController {
  constructor(readonly registerUser: RegisterService) { }
  @Post('/')
  async register(@Request() req, @Body() body) {
    return this.registerUser.register(body);
  }
}
