import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterService {
  constructor(private prisma: PrismaClient) { }
  async register({ email, password }: { email: string; password: string }) {
    try {
      const salt = await bcrypt.genSalt(15);
      const hash = await bcrypt.hash(password + email, salt);

      const newUser = await this.prisma.users.create({
        select: {
          email: true
        },
        data: {
          email,
          senha: hash
        },
      })
      return {
        newUser: newUser.email
      }
    } catch (error) {
      throw new ConflictException()
    }
  }
}
// {
//   id: 'abca7f85-3eb6-4ddb-a25b-d10603eda2b3',
//   email: 'email@email.com',
//   name: null,
//   password: '$2b$10$Xw7zCiTEodCwm1Wf01rcIubMqDL85qeXEaJnMiywWQGmkEGO/aKRq',
//   avatar: null,
//   createdAt: 2024-07-08T23:22:50.253Z
// }
