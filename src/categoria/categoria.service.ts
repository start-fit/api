import { Injectable } from '@nestjs/common';
import { categoriaTreino } from '@prisma/client';
import { PrismaService } from 'prisma/lib/prisma.service';

@Injectable()
export class CategoriaService {
  constructor(private prisma: PrismaService) { }

  async listarCategoraisServie() {
    return await this.prisma.categoriaTreino.findMany({
      omit: { deletedAt: true, updateAt: true },
      orderBy: {
        treino: { _count: 'asc' }
      }
    });
  }
}
