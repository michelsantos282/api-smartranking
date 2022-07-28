import { IsEmail, IsNotEmpty } from 'class-validator';

export class AtualizarJogadorDto {
  @IsNotEmpty()
  telefoneCelular: string;

  @IsNotEmpty()
  nome: string;
}
