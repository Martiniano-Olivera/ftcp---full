import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Nombre de usuario único' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ description: 'Contraseña del empleado' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Nombre completo del empleado' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Email del empleado' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Indica si el empleado está activo', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
