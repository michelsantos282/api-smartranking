import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarJogador(criaJogadorDTO: CriarJogadorDto): Promise<Jogador> {
    const { email } = criaJogadorDTO;

    const jogadorExiste = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorExiste) {
      throw new BadRequestException(
        `Jogador com o email ${email} já cadastrado`,
      );
    }

    const jogadorCriado = new this.jogadorModel(criaJogadorDTO);
    return await jogadorCriado.save();
  }

  async atualizarJogador(
    _id: string,
    criaJogadorDTO: AtualizarJogadorDto,
  ): Promise<void> {
    const jogadorExiste = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorExiste) {
      throw new BadRequestException(`Jogador com o id ${_id} não encontrado!`);
    }

    this.jogadorModel
      .findOneAndUpdate({ _id: _id }, { $set: criaJogadorDTO })
      .exec();
  }

  async consultarJogadoresPeloId(_id: string): Promise<Jogador> {
    const jogadorExiste = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorExiste) {
      throw new NotFoundException(`Jogador com o id ${_id} não encontrado!`);
    }

    return jogadorExiste;
  }

  async deletarJogador(_id: string): Promise<any> {
    const jogadorExiste = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorExiste) {
      throw new NotFoundException(`Jogador com o id ${_id} não encontrado!`);
    }

    return await this.jogadorModel.deleteOne({ _id }).exec();
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find();
  }
}
