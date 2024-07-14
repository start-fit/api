import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'prisma/lib/prisma.service';

@Injectable()
export class TreinoService {
  constructor(private prisma: PrismaService) { }

  async listarTrenioCategoria(idCategoria: UUID) {
    const result = await this.prisma.treino.findMany({
      omit: { deletedAt: true, updateAt: true, idCategoria: true, id: true },
      where: {
        idCategoria
      }
    });
    return result;
  }

  async adcionarTreinousuario(dataTreino: AdcionarTreinoUsuario) {
    const result = await this.prisma.$transaction(async (trx) => {
      let inforTreino: { repeticao: number, serie: number, id: string };
      if (!dataTreino?.repeticao || !dataTreino?.serie) {
        inforTreino = await trx.treino.findUnique({
          select: {
            id: true,
            serie: true,
            repeticao: true
          },
          where: { id: dataTreino.treinoId, }
        })
      }

      const configTreinoUsuario = await trx.usuarioTreino.create({
        data: {
          nomeTreino: dataTreino.nomeTreino,
          idUsuario: { connect: { id: dataTreino?.userId } },
          configuracaoTreinoUsuario: {
            create: {
              repeticao: dataTreino?.repeticao || inforTreino.repeticao,
              serie: dataTreino?.serie || inforTreino.serie,
              idTreino: { connect: { id: dataTreino?.treinoId || inforTreino.id } },
            }
          }
        }
      });

      return configTreinoUsuario
    })
    return result;
  }
}
