import { Controller, Get } from '@nestjs/common';
import { CategoriaService } from './categoria.service';

@Controller('categoria')
export class CategoriaController {
  constructor(private servieCategoria: CategoriaService) { }

  @Get()
  async listarCategorias() {
    const categorias = await this.servieCategoria.listarCategoraisServie();
    return {
      categorias,
      status: 200
    }
  }
}
