import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { CategoriasValidacaoParametrosPipe } from './pipes/categorias-validacao-parametros.pipe';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriaService: CategoriasService) {}
  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() criarCategoriaDTO: CriarCategoriaDto,
  ): Promise<Categoria> {
    return await this.categoriaService.criarCategoria(criarCategoriaDTO);
  }

  @Get()
  async consultarCategorias(): Promise<Categoria[]> {
    return await this.categoriaService.consultarCategorias();
  }

  @Get('/:categoria')
  async consultarCategoriasPeloId(
    @Param('categoria', CategoriasValidacaoParametrosPipe) categoria: string,
  ): Promise<Categoria> {
    return await this.categoriaService.consultarCategoria(categoria);
  }

  @Put('/:categoria')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('categoria', CategoriasValidacaoParametrosPipe) categoria: string,
  ): Promise<void> {
    await this.categoriaService.atualizarCategoria(
      categoria,
      atualizarCategoriaDto,
    );
  }

  @Delete('/:categoria')
  async deletarCategoria(
    @Param('categoria', CategoriasValidacaoParametrosPipe) categoria: string,
  ): Promise<void> {
    await this.categoriaService.deletarCategoria(categoria);
  }

  @Post('/:categoria/jogadores/:idJogador')
  async atribuirJogadorCategoria(
    @Param(CategoriasValidacaoParametrosPipe) params: string[],
  ): Promise<void> {
    return await this.categoriaService.atribuirCategoriaJogador(params);
  }
}
