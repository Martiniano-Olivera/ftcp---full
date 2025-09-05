import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmployeesService } from '../employees/employees.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly jwtService: JwtService,
  ) {}

  // Validar credenciales del empleado
  async validateEmployee(username: string, password: string): Promise<any> {
    try {
      const employee = await this.employeesService.getEmployeeByUsername(username);
      const isPasswordValid = await employee.comparePassword(password);
      
      if (isPasswordValid) {
        const { password: _, ...result } = employee;
        return result;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Login del empleado
  async login(loginDto: LoginDto) {
    const employee = await this.validateEmployee(loginDto.username, loginDto.password);
    
    if (!employee) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { 
      username: employee.username, 
      sub: employee.id,
      fullName: employee.fullName,
      email: employee.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      employee: {
        id: employee.id,
        username: employee.username,
        fullName: employee.fullName,
        email: employee.email,
      },
    };
  }

  // Verificar token JWT
  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
