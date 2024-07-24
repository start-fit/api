import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'prisma/lib/prisma.service';
import { AdcionarTreinoUsuario, AtualizarTreinoUsuario, ExcluirTreinoUsuario, MarcarTreinoRealizado } from './treino';
import { configuracaoTreinoUsuario, Prisma } from '@prisma/client';

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
    return await this.prisma.historicoDeTrenio.create({
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
  }

  async listarTrenioUsuario(data: { idUsuario: UUID, idTreino: UUID, idCategoria: UUID }) {
    return await this.prisma.treino.findMany({
      select: {
        id: true,
        serie: true,
        repeticao: true,
        tutorialMedia: true,
        nomeTreino: true,
        configuracaoTreinoUsuario: {
          select: {
            id: true,
            serie: true,
            repeticao: true,
            treinoId: true,
          },
          where: {
            idUsuarioTreino: {
              usersId: data.idUsuario,
              id: data.idTreino
            },
            deletedAt: null
          },
          take: 1
        }
      },
      where: {
        categoriaTreinoId: { id: data.idCategoria },
        idCategoria: data.idCategoria
      }
    });
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
      const idTreinos = dataTreino.treinos.map(({ treinoId }) => treinoId);

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
            serie: Number(crr?.serie || defaultCfg.serie),
            repeticao: Number(crr?.repeticao || defaultCfg.repeticao)
          }];
        }
        return [...acc, {
          ...crr,
          serie: Number(crr?.serie),
          repeticao: Number(crr?.repeticao)
        }];
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
    const listaUpdates: Prisma.PrismaPromise<configuracaoTreinoUsuario>[] = [];
    data.treinos.forEach((treino) => {
      listaUpdates.push(this.prisma.configuracaoTreinoUsuario.upsert({
        update: {
          serie: treino.serie,
          repeticao: treino.repeticao,
        },
        create: {
          serie: treino.serie,
          repeticao: treino.repeticao,
          idTreino: { connect: { id: treino.treinoId } },
          idUsuarioTreino: {
            connect: {
              id: treino.id
            }
          }
        },
        where: {
          id: treino.id,
          treinoId: treino.treinoId,
        }
      }));
    });
    await this.prisma.$transaction(listaUpdates);
    return {};
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
