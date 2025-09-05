import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderFileDto {
  @ApiProperty({ description: 'Nombre del archivo' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'URL del archivo' })
  @IsString()
  url: string;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Nombre del cliente' })
  @IsString()
  clienteNombre: string;

  @ApiProperty({ description: 'Teléfono del cliente' })
  @IsString()
  clienteTelefono: string;

  @ApiProperty({ description: 'Archivos del pedido', type: [CreateOrderFileDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderFileDto)
  archivos: CreateOrderFileDto[];

  @ApiProperty({ description: 'Indica si el pedido está pagado', required: false })
  @IsOptional()
  @IsBoolean()
  paid?: boolean;
}
