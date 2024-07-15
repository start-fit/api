import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'prisma/lib/prisma.service';
import { AdcionarTreinoUsuario, AtualizarTreinoUsuario, ExcluirTreinoUsuario, MarcarTreinoRealizado } from './treino';

@Injectable()
export class TreinoService {
  constructor(private prisma: PrismaService) { }

  async listarTrenioCategoria(idCategoria: UUID) {
    const result = await this.prisma.treino.findMany({
      omit: { deletedAt: true, updateAt: true, idCategoria: true },
      where: {
        categoriaTreinoId: { id: idCategoria },
        idCategoria: idCategoria
      }
    });
    return result;
  }

  async marcarTreinoUsuarioRelaizado(data: MarcarTreinoRealizado) {
    const result = await this.prisma.historicoDeTrenio.create({
      data: {
        repeticao: data.repeticao,
        serie: data.serie,
        configuracaoTreinoUsuario: {
          connect: {
            id: data.configTreinoId
          }
        }
      }
    });
    return result;
  }

  async listarTrenioUsuario(data: { idUsuario: UUID, idTreino: UUID }) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const result = await this.prisma.usuarioTreino.findMany({
      select: {
        id: true,
        nomeTreino: true,
        configuracaoTreinoUsuario: {
          select: {
            id: true,
            serie: true,
            repeticao: true,
            historicoDeTrenio: {
              select: { serie: true, repeticao: true, createdAt: true },
              take: 1,
              orderBy: { createdAt: 'desc' },
              where: {
                createdAt: {
                  gte: todayStart,
                  lte: todayEnd,
                }
              }
            },
            idTreino: {
              select: {
                serie: true,
                repeticao: true,
                tutorialMedia: true,
              }
            }
          }
        }
      },
      where: {
        usersId: data.idUsuario,
        id: data.idTreino
      }
    });

    return result;
  }

  async listarTreniosUsuario(idUsuario: UUID) {
    const result = await this.prisma.usuarioTreino.findMany({
      select: {
        id: true,
        nomeTreino: true,
        _count: {
          select: { configuracaoTreinoUsuario: true }
        }
      },
      where: {
        usersId: idUsuario
      }
    });
    return result;
  }

  async adcionarTreinousuario(dataTreino: AdcionarTreinoUsuario) {
    return await this.prisma.$transaction(async (trx) => {
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
  }

  async atulizarTreinoUsuario(data: AtualizarTreinoUsuario) {
    return await this.prisma.configuracaoTreinoUsuario.update({
      data: {
        serie: data.serie,
        repeticao: data.repeticao
      },
      select: { id: true },
      where: {
        id: data.configTreinoId,
        deletedAt: null,
        idUsuarioTreino: { usersId: data.userId }
      }
    })
  }

  async excluirTreinoUsuario(data: ExcluirTreinoUsuario) {
    return await this.prisma.configuracaoTreinoUsuario.update({
      data: {
        deletedAt: new Date()
      },
      select: { id: true },
      where: {
        id: data.configTreinoId,
        deletedAt: null,
        idUsuarioTreino: { usersId: data.userId }
      }
    })
  }
}
