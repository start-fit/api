import { Module } from '@nestjs/common';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';
import { PrismaService } from 'prisma/lib/prisma.service';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService, PrismaService]
})

export class CategoriaModule { }
