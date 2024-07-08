import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('/')
export class LoginController {
  constructor(readonly loginService: LoginService) { }
  @Post('/')
  async login(@Body() body) {
    return await this.loginService.login(body);
  }
}
