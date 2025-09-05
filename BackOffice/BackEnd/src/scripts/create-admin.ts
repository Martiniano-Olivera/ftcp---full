import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { EmployeesService } from '../employees/employees.service';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function createAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const employeesService = app.get(EmployeesService);

  try {
    const adminData = {
      username: 'admin',
      password: 'admin123',
      fullName: 'Administrador del Sistema',
      email: 'admin@fotocopiadora.com',
      isActive: true,
    };

    console.log('🔧 Creando empleado administrador...');
    
    const admin = await employeesService.createEmployee(adminData);
    
    console.log('✅ Empleado administrador creado exitosamente:');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Nombre: ${admin.fullName}`);
    console.log(`   Email: ${admin.email}`);
    console.log('');
    console.log('🔑 Credenciales de acceso:');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Password: ${adminData.password}`);
    console.log('');
    console.log('⚠️  IMPORTANTE: Cambiar la contraseña después del primer login!');
    
  } catch (error) {
    if (error.message.includes('ya existe')) {
      console.log('ℹ️  El empleado administrador ya existe');
    } else {
      console.error('❌ Error al crear empleado administrador:', error.message);
    }
  } finally {
    await app.close();
  }
}

createAdmin();
