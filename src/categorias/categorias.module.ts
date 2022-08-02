import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from './interfaces/categoria.schema';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { JogadoresModule } from 'src/jogadores/jogadores.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Categoria', schema: CategoriaSchema }]),
    JogadoresModule,
  ],
  providers: [CategoriasService],
  controllers: [CategoriasController],
})
export class CategoriasModule {}
