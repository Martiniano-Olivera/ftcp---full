// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { EmployeesService } from './employees/employees.service';
// import { OrdersService } from './orders/orders.service';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const raw = process.env.CORS_ORIGIN ?? '';
//   const whitelist = raw
//     .split(',')
//     .map(s => s.trim().replace(/\/$/, '')) // sin slash final
//     .filter(Boolean);
//   const allowLocalhostAnyPort = /^http:\/\/localhost:\d+$/;

//   app.enableCors({
//     origin: true, // refleja el Origin que venga
//     credentials: false, // solo JWT por header, sin cookies
//     methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
//     preflightContinue: false,
//     optionsSuccessStatus: 204, // respuesta OK al preflight
//     // No pongas allowedHeaders: el middleware "cors" refleja los que pide el browser
//   });

//   // Inicialización automática para MVP
//   const employeesService = app.get(EmployeesService);
//   const ordersService = app.get(OrdersService);

//   // Crear usuario admin/demo si no existe
//   try {
//     const adminExists = await employeesService.getEmployeeByUsername('admin');
//     console.log('Usuario admin ya existe.');
//   } catch (error) {
//     await employeesService.createEmployee({
//       username: 'admin',
//       password: 'demo', // para MVP, plain text; en producción usar hash
//       fullName: 'Administrador',
//       email: 'admin@fotocopiadora.com',
//     });
//     console.log('Usuario admin/demo creado.');
//   }

//   // Crear pedido de prueba si no existe
//   const pedidos = await ordersService.getAllOrders();
//   if (pedidos.length === 0) {
//     await ordersService.createOrder({
//       clienteNombre: 'Cliente Test',
//       clienteTelefono: '123456789',
//       archivos: [
//         {
//           nombre: 'archivo1.pdf',
//           url: 'https://example.com/archivo1.pdf',
//         },
//         {
//           nombre: 'archivo2.pdf',
//           url: 'https://example.com/archivo2.pdf',
//         },
//       ],
//       paid: true,
//     });
//     console.log('Pedido de prueba creado.');
//   }

//   await app.listen(process.env.PORT || 3000);
//   console.log(`API on http://localhost:${process.env.PORT || 3000}`);
// }
// bootstrap();

// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1) CORS permisivo para desarrollo (refleja el Origin)
  app.enableCors({
    origin: true, // refleja el Origin que venga
    credentials: false,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 204,
  });

  // 2) Respuesta explícita al preflight OPTIONS (por si el middleware no intercepta)
  app.use((req, res, next) => {
    const origin = req.headers.origin as string | undefined;
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
    }
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    // refleja los headers que pide el browser en el preflight (authorization, content-type, etc.)
    const reqHeaders =
      (req.headers['access-control-request-headers'] as string) ||
      'Authorization,Content-Type';
    res.header('Access-Control-Allow-Headers', reqHeaders);
    // si usás cookies en el futuro, poné true aquí y en enableCors
    res.header('Access-Control-Allow-Credentials', 'false');

    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  // ...tu lógica de seed (admin/demo, pedido de prueba) queda como está...

  await app.listen(process.env.PORT || 3000);
  console.log(`API on http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
