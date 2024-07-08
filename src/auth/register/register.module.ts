import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [RegisterService, PrismaClient],
  controllers: [RegisterController],
})
export class RegisterModule { }
