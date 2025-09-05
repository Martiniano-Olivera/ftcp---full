import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Empleados')
@Controller('employees')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo empleado' })
  @ApiResponse({ status: 201, description: 'Empleado creado exitosamente', type: Employee })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Username o email ya existe' })
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return await this.employeesService.createEmployee(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los empleados' })
  @ApiResponse({ status: 200, description: 'Lista de empleados', type: [Employee] })
  async getAllEmployees(): Promise<Employee[]> {
    return await this.employeesService.getAllEmployees();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un empleado por ID' })
  @ApiResponse({ status: 200, description: 'Empleado encontrado', type: Employee })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  async getEmployeeById(@Param('id') id: string): Promise<Employee> {
    return await this.employeesService.getEmployeeById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un empleado' })
  @ApiResponse({ status: 200, description: 'Empleado actualizado exitosamente', type: Employee })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  @ApiResponse({ status: 409, description: 'Username o email ya existe' })
  async updateEmployee(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return await this.employeesService.updateEmployee(id, updateEmployeeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desactivar un empleado' })
  @ApiResponse({ status: 204, description: 'Empleado desactivado exitosamente' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  async deleteEmployee(@Param('id') id: string): Promise<void> {
    await this.employeesService.deleteEmployee(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activar un empleado' })
  @ApiResponse({ status: 200, description: 'Empleado activado exitosamente', type: Employee })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  async activateEmployee(@Param('id') id: string): Promise<Employee> {
    return await this.employeesService.activateEmployee(id);
  }
}
