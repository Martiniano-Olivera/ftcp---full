import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePublicOrderDto {
  @ApiProperty()
  @IsString()
  clienteNombre: string;

  @ApiProperty()
  @IsString()
  clienteTelefono: string;

  // Solo para documentación; los archivos reales vienen vía multipart
  @ApiProperty({ type: 'string', format: 'binary', required: false, isArray: true })
  files?: any;
}
