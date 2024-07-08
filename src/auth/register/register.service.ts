import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterService {
  constructor(private prisma: PrismaClient) { }
  async register({ email, password }: { email: string; password: string }) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password + email, salt);
    // const isMatch = await bcrypt.compare(password + email, hash);

    const newUser = await this.prisma.users.create({
      data: {
        email,
        password: hash
      },
    })
    console.log(newUser);

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
