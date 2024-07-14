import { Controller, Get, Query } from '@nestjs/common';
import { TreinoService } from './treino.service';
import { UUID } from 'crypto';

type ListaCategoria = {
  idCategoria: UUID
}

@Controller('treino')
export class TreinoController {
  constructor(private treino: TreinoService) { }

  @Get()
  async listarTreinosCategoria(@Query() { idCategoria }: ListaCategoria) {
    const treinos = await this.treino.listarTrenioCategoria(idCategoria);
    return {
      treinos,
      status: 200
    }
  }
}
