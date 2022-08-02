import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class CategoriasValidacaoParametrosPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException(
        `O Valor do parametro ${metadata.data} deve ser informado`,
      );
    }

    return value;
  }
}
