import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePublicOrderDto {
  @ApiProperty()
  @IsString()
  clienteNombre: string;

  @ApiProperty()
  @IsString()
  clienteTelefono: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'Archivos PDF', isArray: true })
  files?: any;
}
