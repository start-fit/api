import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginService } from '../login/login.service';

@Injectable()
export class RegisterService {
  constructor(private prisma: PrismaClient, private loginUser: LoginService) { }
  async register({ nome, email, password }: { nome: string; email: string; password: string }) {
    try {
      const salt = await bcrypt.genSalt(15);
      const hash = await bcrypt.hash(password + email, salt);

      const newUser = await this.prisma.users.create({
        select: {
          email: true
        },
        data: {
          nome,
          email,
          senha: hash
        },
      })
      return await this.loginUser.login({ email: newUser.email, password });;
    } catch (error) {
      console.log(error);
      throw new ConflictException()
    }
  }
}
