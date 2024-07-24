import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Put, Query, Req } from '@nestjs/common';
import { TreinoService } from './treino.service';
import { Request } from 'express';
import { UUID } from 'crypto';
import type { AdcionarTreinoUsuario, AtualizarTreinoUsuario, ExcluirTreinoUsuario, ListaCategoria, MarcarTreinoRealizado } from './treino';

@Controller('treino')
export class TreinoController {
  constructor(private treino: TreinoService) { }

  @Get()
  async listarTreinosCategoriaController(@Query() { idCategoria }: ListaCategoria) {
    if (!idCategoria) throw new BadRequestException('idCategoria is required');
    const treinos = await this.treino.listarTrenioCategoria(idCategoria);
    return {
      treinos,
      status: 200
    }
  }

  @Get('/usuario')
  async listarTreinosUsuarioController(@Req() req: Request,
    @Query() { idTreino, idCategoria }: { idTreino: UUID, idCategoria: UUID }) {
    let treinos = [];
    if (idTreino) {
      treinos = await this.treino.listarTrenioUsuario({
        idUsuario: req.user['sub'],
        idTreino,
        idCategoria
      });
    } else {
      treinos = await this.treino.listarTreniosUsuario(req.user['sub']);
    }
    return {
      treinos,
      status: 200
    }
  }

  @Post('/realizado')
  async marcarTreinoUsuarioRealizadoController(@Req() req: Request, @Body() cadastroTreino: MarcarTreinoRealizado) {
    const realizado = await this.treino.marcarTreinoUsuarioRelaizado(cadastroTreino);
    return {
      realizado,
      status: 200
    }
  }

  @Post('/usuario')
  async adcionarTreinousuarioController(@Req() req: Request, @Body() cadastroTreino: AdcionarTreinoUsuario) {
    try {
      const treinoCadastrado = await this.treino.adcionarTreinousuario({
        userId: req.user['sub'],
        ...cadastroTreino
      });
      return {
        treinoCadastrado,
        status: 200
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Not Exists',
      }, HttpStatus.BAD_REQUEST, {
        cause: error
      });
    }
  }

  @Put('/usuario')
  async atualizarTreinousuarioController(@Req() req: Request, @Body() atualizarTreino: AtualizarTreinoUsuario) {
    try {
      const treinoAtualizado = await this.treino.atulizarTreinoUsuario({
        userId: req.user?.['sub'],
        ...atualizarTreino,
      });
      return {
        ...treinoAtualizado,
        status: 200
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Not Exists',
      }, HttpStatus.BAD_REQUEST, {
        cause: error
      });
    }
  }

  @Delete('/usuario')
  async excluirTreinousuarioController(@Req() req: Request, @Body() excluirTreino: ExcluirTreinoUsuario) {
    try {
      const treinoExcluido = await this.treino.excluirTreinoUsuario({
        userId: req.user?.['sub'],
        ...excluirTreino
      });
      return {
        ...treinoExcluido,
        status: 200
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Not Exists',
      }, HttpStatus.BAD_REQUEST, {
        cause: error
      });
    }
  }
}
