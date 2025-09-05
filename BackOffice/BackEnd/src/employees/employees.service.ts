import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  // Crear un nuevo empleado
  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    // Verificar si el username ya existe
    const existingUsername = await this.employeeRepository.findOne({
      where: { username: createEmployeeDto.username },
    });
    if (existingUsername) {
      throw new ConflictException('El nombre de usuario ya existe');
    }

    // Verificar si el email ya existe
    const existingEmail = await this.employeeRepository.findOne({
      where: { email: createEmployeeDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('El email ya existe');
    }

    const employee = this.employeeRepository.create(createEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  // Obtener todos los empleados
  async getAllEmployees(): Promise<Employee[]> {
    return await this.employeeRepository.find({
      select: ['id', 'username', 'fullName', 'email', 'isActive', 'createdAt'],
    });
  }

  // Obtener un empleado por ID
  async getEmployeeById(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      select: ['id', 'username', 'fullName', 'email', 'isActive', 'createdAt'],
    });
    if (!employee) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }
    return employee;
  }

  // Obtener un empleado por username (para autenticación)
  async getEmployeeByUsername(username: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { username, isActive: true },
    });
    if (!employee) {
      throw new NotFoundException('Credenciales inválidas');
    }
    return employee;
  }

  // Actualizar un empleado
  async updateEmployee(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.getEmployeeById(id);

    // Si se está actualizando el username, verificar que sea único
    if (
      updateEmployeeDto.username &&
      updateEmployeeDto.username !== employee.username
    ) {
      const existingUsername = await this.employeeRepository.findOne({
        where: { username: updateEmployeeDto.username },
      });
      if (existingUsername) {
        throw new ConflictException('El nombre de usuario ya existe');
      }
    }

    // Si se está actualizando el email, verificar que sea único
    if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
      const existingEmail = await this.employeeRepository.findOne({
        where: { email: updateEmployeeDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('El email ya existe');
      }
    }

    // Si se está actualizando la contraseña, encriptarla
    if (updateEmployeeDto.password) {
      updateEmployeeDto.password = await bcrypt.hash(
        updateEmployeeDto.password,
        10,
      );
    }

    Object.assign(employee, updateEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  // Eliminar un empleado (desactivar)
  async deleteEmployee(id: string): Promise<void> {
    const employee = await this.getEmployeeById(id);
    employee.isActive = false;
    await this.employeeRepository.save(employee);
  }

  // Activar un empleado
  async activateEmployee(id: string): Promise<Employee> {
    const employee = await this.getEmployeeById(id);
    employee.isActive = true;
    return await this.employeeRepository.save(employee);
  }
}
