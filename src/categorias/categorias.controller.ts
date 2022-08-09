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
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

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
    @Param('categoria', ValidacaoParametrosPipe) categoria: string,
  ): Promise<Categoria> {
    return await this.categoriaService.consultarCategoria(categoria);
  }

  @Put('/:categoria')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('categoria', ValidacaoParametrosPipe) categoria: string,
  ): Promise<void> {
    await this.categoriaService.atualizarCategoria(
      categoria,
      atualizarCategoriaDto,
    );
  }

  @Delete('/:categoria')
  async deletarCategoria(
    @Param('categoria', ValidacaoParametrosPipe) categoria: string,
  ): Promise<void> {
    await this.categoriaService.deletarCategoria(categoria);
  }

  @Post('/:categoria/jogadores/:idJogador')
  async atribuirJogadorCategoria(
    @Param(ValidacaoParametrosPipe) params: string[],
  ): Promise<void> {
    return await this.categoriaService.atribuirCategoriaJogador(params);
  }
}
