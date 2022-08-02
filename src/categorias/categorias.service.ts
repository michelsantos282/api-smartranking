import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) {}

  async criarCategoria(
    criarCategoriaDTO: CriarCategoriaDto,
  ): Promise<Categoria> {
    const { categoria } = criarCategoriaDTO;

    const categoriaExiste = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (categoriaExiste) {
      throw new BadRequestException(
        `Categoria com o nome ${categoria} já cadastrada`,
      );
    }

    const categoriaCriada = new this.categoriaModel(criarCategoriaDTO);

    return await categoriaCriada.save();
  }

  async consultarCategorias(): Promise<Categoria[]> {
    return await this.categoriaModel.find().populate('jogadores').exec();
  }

  async consultarCategoria(categoria: string): Promise<Categoria> {
    const categoriaEncontrada = await this.procurarCategoria(categoria);

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${categoria} não encontrada`);
    }

    return categoriaEncontrada.populate('jogadores');
  }

  async atualizarCategoria(
    categoria: string,
    atualizarCategoriaDto: AtualizarCategoriaDto,
  ): Promise<void> {
    const categoriaExiste = await this.procurarCategoria(categoria);

    if (!categoriaExiste) {
      throw new BadRequestException(`Categoria ${categoria} não encontrada!`);
    }

    this.categoriaModel
      .findOneAndUpdate(
        { categoria: categoria },
        { $set: atualizarCategoriaDto },
      )
      .exec();
  }

  async deletarCategoria(categoria: string): Promise<void> {
    const categoriaExiste = await this.procurarCategoria(categoria);

    await this.categoriaModel.deleteOne({ categoriaExiste }).exec();
  }

  async atribuirCategoriaJogador(params: string[]): Promise<void> {
    const categoria = params['categoria'];
    const idJogador = params['idJogador'];

    const categoriaExiste = await this.procurarCategoria(categoria);

    await this.jogadoresService.consultarJogadoresPeloId(idJogador);

    const jogadorJaCadastradoCategoria = await this.categoriaModel
      .find({ categoria })
      .where('jogadores')
      .in(idJogador)
      .exec();

    if (jogadorJaCadastradoCategoria.length > 0) {
      throw new BadRequestException(
        `O Jogador com o id ${idJogador} já cadastrado na categoria ${categoria}!`,
      );
    }

    categoriaExiste.jogadores.push(idJogador);

    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: categoriaExiste })
      .exec();
  }

  private async procurarCategoria(categoria: string): Promise<Categoria> {
    const categoriaExiste = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!categoriaExiste) {
      throw new BadRequestException(`Categoria ${categoria} não encontrada!`);
    }

    return categoriaExiste;
  }
}
