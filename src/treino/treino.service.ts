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
      const idTreinos = dataTreino.treinos.map(({ treinoId }) => treinoId)
      const inforTreino = await trx.treino.findMany({
        select: {
          id: true,
          serie: true,
          repeticao: true
        },
        where: { id: { in: idTreinos }, }
      });

      const dataTreinos = dataTreino.treinos.reduce((acc, crr) => {
        if (!crr?.repeticao || !crr?.serie) {
          const defaultCfg = inforTreino.find(({ id }) => id === crr.treinoId);
          return [...acc, {
            ...crr,
            serie: crr?.serie || defaultCfg.serie,
            repeticao: crr?.repeticao || defaultCfg.repeticao
          }];
        }
        return acc;
      }, []);

      const configTreinoUsuario = await trx.usuarioTreino.create({
        data: {
          nomeTreino: dataTreino.nomeTreino,
          idUsuario: { connect: { id: dataTreino?.userId } },
          configuracaoTreinoUsuario: {
            createMany: {
              data: dataTreinos
            }
          }
        }
      });
      return configTreinoUsuario
    })
    return result;
  }
}
