import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePublicOrderDto {
  @ApiProperty({ description: 'Nombre del cliente' })
  @IsString()
  clienteNombre: string;

  @ApiProperty({ description: 'Teléfono del cliente' })
  @IsString()
  clienteTelefono: string;

  @ApiProperty({
    description: 'Archivos PDF',
    type: 'string',
    format: 'binary',
    required: false,
    isArray: true,
  })
  files?: any[];
}
