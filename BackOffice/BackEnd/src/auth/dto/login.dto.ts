import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Nombre de usuario del empleado' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Contraseña del empleado' })
  @IsString()
  @MinLength(6)
  password: string;
}
