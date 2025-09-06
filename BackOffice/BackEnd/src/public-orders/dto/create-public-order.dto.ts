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
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
    description: 'Archivos PDF',
  })
  files?: any;
}
