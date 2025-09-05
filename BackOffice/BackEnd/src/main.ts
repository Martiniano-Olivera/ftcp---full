// import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { AppModule } from './app.module';
// import * as dotenv from 'dotenv';

// // Cargar variables de entorno
// dotenv.config();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Configurar CORS para Angular
//   app.enableCors({
//     origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
//     credentials: true,
//   });

//   // Configurar validación global con class-validator
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );

//   // Configurar Swagger
//   const config = new DocumentBuilder()
//     .setTitle('API Kiosco Pedidos Backoffice')
//     .setDescription('API para el backoffice de fotocopiadora - MVP')
//     .setVersion('1.0')
//     .addBearerAuth()
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);

//   const port = process.env.PORT || 3000;
//   await app.listen(port);

//   console.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}`);
//   console.log(`📚 Documentación Swagger en: http://localhost:${port}/api`);
// }

// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EmployeesService } from './employees/employees.service';
import { OrdersService } from './orders/orders.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Inicialización automática para MVP
  const employeesService = app.get(EmployeesService);
  const ordersService = app.get(OrdersService);

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
    credentials: true,
  });

  // Crear usuario admin/demo si no existe
  try {
    const adminExists = await employeesService.getEmployeeByUsername('admin');
    console.log('Usuario admin ya existe.');
  } catch (error) {
    await employeesService.createEmployee({
      username: 'admin',
      password: 'demo', // para MVP, plain text; en producción usar hash
      fullName: 'Administrador',
      email: 'admin@fotocopiadora.com',
    });
    console.log('Usuario admin/demo creado.');
  }

  // Crear pedido de prueba si no existe
  const pedidos = await ordersService.getAllOrders();
  if (pedidos.length === 0) {
    await ordersService.createOrder({
      clienteNombre: 'Cliente Test',
      clienteTelefono: '123456789',
      archivos: [
        {
          nombre: 'archivo1.pdf',
          urlDrive: 'https://drive.google.com/file/d/archivo1',
        },
        {
          nombre: 'archivo2.pdf',
          urlDrive: 'https://drive.google.com/file/d/archivo2',
        },
      ],
      paid: true,
    });
    console.log('Pedido de prueba creado.');
  }

  await app.listen(3000);
  console.log(`Servidor corriendo en http://localhost:3000`);
}
bootstrap();
