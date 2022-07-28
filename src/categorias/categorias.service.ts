import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
  ) {}

  async criarCategoria(
    criarCategoriaDTO: CriarCategoriaDto,
  ): Promise<Categoria> {
    const { categoria } = criarCategoriaDTO;

    const categoriaExiste = await this.categoriaModel.findOne({ categoria });

    if (categoriaExiste) {
      throw new BadRequestException(
        `Categoria com o nome ${categoria} já cadastrada`,
      );
    }

    const categoriaCriada = new this.categoriaModel(criarCategoriaDTO);

    return await categoriaCriada.save();
  }
}
