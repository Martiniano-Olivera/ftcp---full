import { ApiProperty } from '@nestjs/swagger';
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ['password'] as const),
) {
  @ApiProperty({ description: 'Nueva contraseña (opcional)', required: false })
  password?: string;
}
