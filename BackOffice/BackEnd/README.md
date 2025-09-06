# 🖨️ Kiosco Pedidos Backoffice Backend

Backend NestJS modular para el backoffice de fotocopiadora - MVP

## 🚀 Características

- **Arquitectura modular** con separación clara de responsabilidades
- **Autenticación JWT** para empleados
- **Base de datos PostgreSQL** con TypeORM
- **Validación de datos** con class-validator
- **Documentación automática** con Swagger
- **CORS configurado** para Angular
- **Variables de entorno** para configuración

## 🧑‍💻 Cómo correr localmente

```bash
npm ci && npm run build && npm run migration:run && npm run start:prod
curl http://localhost:3000/health
```

Las migraciones usan `DIRECT_URL` (conexión directa al puerto 5432) mientras que la aplicación en ejecución utiliza `DATABASE_URL` a través del pooler de Supabase (pgbouncer en 6543) siempre con SSL habilitado.

## 📋 Módulos

### 📦 Módulo Pedidos (`/orders`)
- `GET /orders` - Listar pedidos pendientes
- `GET /orders/all` - Listar todos los pedidos
- `GET /orders/:id` - Ver detalle de pedido
- `PATCH /orders/:id/ready` - Marcar pedido como listo
- `GET /orders/:id/whatsapp-link` - Generar link de WhatsApp
- `POST /orders` - Crear nuevo pedido
- `PATCH /orders/:id` - Actualizar pedido
- `DELETE /orders/:id` - Eliminar pedido
- `GET /orders/stats/summary` - Estadísticas de pedidos

### 👥 Módulo Empleados (`/employees`)
- `GET /employees` - Listar empleados
- `GET /employees/:id` - Ver empleado
- `POST /employees` - Crear empleado
- `PATCH /employees/:id` - Actualizar empleado
- `DELETE /employees/:id` - Desactivar empleado
- `PATCH /employees/:id/activate` - Activar empleado

### 🔐 Módulo Autenticación (`/auth`)
- `POST /auth/login` - Login de empleado

## 🛠️ Instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta de Supabase con base de datos PostgreSQL

### 1. Clonar y instalar dependencias
```bash
git clone <repository-url>
cd kiosco-pedidos-backend
npm ci
```

### 2. Configurar variables de entorno
Copiar el archivo de ejemplo y completar con tus valores:
```bash
cp .env.example .env
```

Variables principales:

- `DIRECT_URL`: conexión directa a Postgres (puerto 5432, `sslmode=verify-full`) utilizada para migraciones.
- `DATABASE_URL`: conexión al pooler de Supabase (`pgbouncer=true`, puerto 6543, `sslmode=require`) utilizada en tiempo de ejecución.
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- `JWT_SECRET`, `JWT_EXPIRES_IN`.
- `PORT`, `CORS_ORIGIN`.
  - En producción agrega el origen del front público (ej: `http://localhost:4200`) a `CORS_ORIGIN` si corre en otro puerto.

### 3. Ejecutar migraciones
Las migraciones se ejecutan contra la conexión directa (5432):
```bash
npm run build
npm run migration:run
```

### 4. Iniciar la aplicación
La aplicación se conecta al pooler (6543) en tiempo de ejecución:
```bash
npm run start:prod
```

## 📚 Documentación API

Una vez ejecutando, la documentación Swagger estará disponible en:
```
http://localhost:3000/api
```

## 🔑 Autenticación

### 1. Crear empleado inicial
```bash
# Usar el endpoint POST /employees
{
  "username": "admin",
  "password": "admin123",
  "fullName": "Administrador",
  "email": "admin@fotocopiadora.com"
}
```

### 2. Login
```bash
POST /auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

### 3. Usar token
Incluir en headers:
```
Authorization: Bearer <token>
```

## 🗄️ Estructura de Base de Datos

### Tabla `orders`
- `id` (UUID, PK)
- `clienteNombre` (VARCHAR)
- `clienteTelefono` (VARCHAR)
- `archivos` (JSONB) - Array de archivos
- `estado` (ENUM: 'PENDIENTE' | 'LISTO')
- `paid` (BOOLEAN)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Tabla `employees`
- `id` (UUID, PK)
- `username` (VARCHAR, UNIQUE)
- `password` (VARCHAR, encriptada)
- `fullName` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `isActive` (BOOLEAN)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Probar endpoint público con PowerShell

```powershell
$form = @{
  clienteNombre = "Cliente QA"
  clienteTelefono = "1122334455"
  files = Get-Item "C:\ruta\archivo1.pdf", "C:\ruta\archivo2.pdf"
}
Invoke-RestMethod -Uri http://localhost:3000/public/orders -Method Post -Form $form
```

## 📝 Scripts Disponibles

- `npm run start` - Iniciar aplicación
- `npm run start:dev` - Iniciar en modo desarrollo con hot reload
- `npm run build` - Compilar para producción
- `npm run start:prod` - Iniciar versión compilada
- `npm run lint` - Ejecutar linter
- `npm run format` - Formatear código

## 🔧 Configuración de Desarrollo

### TypeScript
- Target: ES2020
- Decorators habilitados
- Path mapping configurado

### Linting
- ESLint con reglas de NestJS
- Prettier para formateo

### Base de Datos
- TypeORM con sincronización automática en desarrollo
- Logging habilitado en desarrollo
- SSL configurado para producción

## 🚀 Despliegue

### Variables de entorno para producción
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=very-long-secure-secret
CORS_ORIGIN=https://yourdomain.com
```

### Docker (opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 🆘 Soporte

Para soporte técnico, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ para Kiosco Pedidos**
