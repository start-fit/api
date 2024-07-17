import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/lib/prisma.service';
import { TreinoController } from './treino.controller';
import { TreinoService } from './treino.service';

@Module({
  providers: [TreinoService, PrismaService],
  controllers: [TreinoController],
  exports: [PrismaService]
})

export class TreinoModule { }
