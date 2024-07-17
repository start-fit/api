import { forwardRef, Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { PrismaClient } from '@prisma/client';
import { LoginModule } from '../login/login.module';

@Module({
  providers: [RegisterService, PrismaClient],
  controllers: [RegisterController],
  imports: [forwardRef(() => LoginModule)]
})

export class RegisterModule { }
