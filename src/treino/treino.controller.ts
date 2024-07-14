import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { TreinoService } from './treino.service';
import { Request } from 'express';

@Controller('treino')
export class TreinoController {
  constructor(private treino: TreinoService) { }

  @Get()
  async listarTreinosCategoriaController(@Query() { idCategoria }: ListaCategoria) {
    const treinos = await this.treino.listarTrenioCategoria(idCategoria);
    return {
      treinos,
      status: 200
    }
  }

  @Post('/usuario')
  async adcionarTreinousuarioController(@Req() req: Request, @Body() cadastroTreino: AdcionarTreinoUsuario) {
    const treinoCadastrado = await this.treino.adcionarTreinousuario({
      userId: req.user?.['sub'],
      ...cadastroTreino
    });
    return {
      treinoCadastrado,
      status: 200
    }
  }
}
