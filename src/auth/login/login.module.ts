import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/lib/prisma.service';

@Module({
  providers: [LoginService, PrismaService, JwtService],
  controllers: [LoginController],
})
export class LoginModule { }
