import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'prisma/lib/prisma.service';

@Injectable()
export class TreinoService {
  constructor(private prisma: PrismaService) { }

  async listarTrenioCategoria(idCategoria: UUID) {
    const result = await this.prisma.treino.findMany({
      omit: { deletedAt: true, updateAt: true, idCategoria: true },
      where: {
        idCategoria
      }
    });
    return result;
  }
}
